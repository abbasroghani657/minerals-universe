import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { ADMIN_EMAILS, MASTER_PASSKEYS } from '@/lib/auth';
import { getCache, setCache, invalidateCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

// Comprehensive admin verification
async function verifyAdmin(req?: Request) {
  try {
    // 1. Direct passkey header check
    if (req) {
      const headerKey = req.headers.get('x-admin-key') || req.headers.get('authorization')?.replace('Bearer ', '');
      if (headerKey && MASTER_PASSKEYS.includes(headerKey.trim())) {
        return { email: 'master@mineralsuniverse.com', isAdmin: true };
      }
    }

    // 2. Authenticated Clerk session check
    const user = await currentUser();
    if (!user) return null;

    const allEmails = (user.emailAddresses || [])
      .map(e => e.emailAddress?.toLowerCase().trim())
      .filter(Boolean);

    if (allEmails.length === 0) return null;

    // Fast check: super admin list
    if (allEmails.some(e => ADMIN_EMAILS.includes(e))) {
      return { user, email: allEmails[0], isAdmin: true };
    }

    // Fast check: Clerk metadata
    if ((user.publicMetadata as any)?.role === 'Admin') {
      return { user, email: allEmails[0], isAdmin: true };
    }

    // Database lookup in TiDB
    const dbUser = await prisma.user.findFirst({
      where: { email: { in: allEmails } }
    });
    if (dbUser?.role === 'Admin') {
      return { user, email: dbUser.email, isAdmin: true };
    }

    return null;
  } catch (err) {
    console.error('[verifyAdmin] Verification error:', err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const cacheKey = 'admin_users_list';
    const cached = getCache<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, fromCache: true });
    }

    const adminEmails = ADMIN_EMAILS;

    // 1. Fetch users from Prisma & Clerk in parallel
    const [prismaUsersRes, clerkUsersRes, ordersRes] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: 'desc' } }).catch(err => {
        console.error('[GET /api/admin/users] Prisma fetch error:', err);
        return [];
      }),
      (async () => {
        try {
          const client = await clerkClient();
          const response = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });
          return (response as any).data || response || [];
        } catch (err) {
          console.error('[GET /api/admin/users] Clerk fetch error:', err);
          return [];
        }
      })(),
      prisma.order.findMany({
        select: { customerEmail: true, total: true, status: true, createdAt: true }
      }).catch(err => {
        console.error('[GET /api/admin/users] Order stats error:', err);
        return [];
      })
    ]);

    const prismaUsers = prismaUsersRes || [];
    const clerkUsers = clerkUsersRes || [];
    const orders = ordersRes || [];

    // 2. Aggregate Orders per email
    const orderStats = new Map<string, { count: number; totalSpent: number; lastOrder: string }>();
    for (const ord of orders) {
      const em = ord.customerEmail?.toLowerCase().trim();
      if (!em) continue;
      const current = orderStats.get(em) || { count: 0, totalSpent: 0, lastOrder: '' };
      current.count += 1;
      current.totalSpent += (ord.total || 0);
      if (!current.lastOrder || new Date(ord.createdAt) > new Date(current.lastOrder)) {
        current.lastOrder = ord.createdAt.toISOString();
      }
      orderStats.set(em, current);
    }

    // 3. Map Prisma users
    const prismaByEmail = new Map<string, any>();
    prismaUsers.forEach(u => {
      if (u.email) prismaByEmail.set(u.email.toLowerCase().trim(), u);
    });

    // 4. Identify any missing Clerk users that should be batch created in Prisma
    const missingToCreate: any[] = [];
    for (const cu of clerkUsers) {
      const primaryEmailObj = cu.emailAddresses?.find((e: any) => e.id === cu.primaryEmailAddressId) || cu.emailAddresses?.[0];
      const email = (primaryEmailObj?.emailAddress || '').toLowerCase().trim();
      if (!email) continue;
      if (!prismaByEmail.has(email)) {
        const fullName = [cu.firstName, cu.lastName].filter(Boolean).join(' ').trim() || cu.username || email.split('@')[0];
        const isConfigAdmin = adminEmails.includes(email);
        missingToCreate.push({
          email,
          name: fullName,
          role: isConfigAdmin ? 'Admin' : 'Customer',
          createdAt: cu.createdAt ? new Date(cu.createdAt) : new Date()
        });
      }
    }

    if (missingToCreate.length > 0) {
      try {
        await prisma.user.createMany({
          data: missingToCreate,
          skipDuplicates: true
        });
        missingToCreate.forEach(m => prismaByEmail.set(m.email, m));
      } catch (e) {
        console.warn('[admin/users] Batch user creation warning:', e);
      }
    }

    const unifiedUsers: any[] = [];
    const seenEmails = new Set<string>();

    // Process Clerk users
    for (const cu of clerkUsers) {
      const primaryEmailObj = cu.emailAddresses?.find((e: any) => e.id === cu.primaryEmailAddressId) || cu.emailAddresses?.[0];
      const email = (primaryEmailObj?.emailAddress || '').toLowerCase().trim();
      if (!email) continue;
      seenEmails.add(email);

      const fullName = [cu.firstName, cu.lastName].filter(Boolean).join(' ').trim() || cu.username || email.split('@')[0];
      const isConfigAdmin = adminEmails.includes(email);
      const dbUser = prismaByEmail.get(email);
      const role = isConfigAdmin ? 'Admin' : (dbUser?.role || 'Customer');
      const userOrders = orderStats.get(email) || { count: 0, totalSpent: 0, lastOrder: '' };

      unifiedUsers.push({
        id: cu.id,
        dbId: dbUser?.id || cu.id,
        email,
        name: fullName,
        imageUrl: cu.imageUrl || null,
        role,
        isEmailVerified: primaryEmailObj?.verification?.status === 'verified',
        createdAt: cu.createdAt ? new Date(cu.createdAt).toISOString() : (dbUser?.createdAt ? new Date(dbUser.createdAt).toISOString() : new Date().toISOString()),
        lastSignInAt: cu.lastSignInAt ? new Date(cu.lastSignInAt).toISOString() : null,
        ordersCount: userOrders.count,
        totalSpent: Math.round(userOrders.totalSpent * 100) / 100,
        lastOrderDate: userOrders.lastOrder || null
      });
    }

    // Include any Prisma-only users
    for (const pu of prismaUsers) {
      const email = (pu.email || '').toLowerCase().trim();
      if (!email || seenEmails.has(email)) continue;
      seenEmails.add(email);

      const isConfigAdmin = adminEmails.includes(email);
      const role = isConfigAdmin ? 'Admin' : (pu.role || 'Customer');
      const userOrders = orderStats.get(email) || { count: 0, totalSpent: 0, lastOrder: '' };

      unifiedUsers.push({
        id: pu.id,
        dbId: pu.id,
        email,
        name: pu.name || email.split('@')[0],
        imageUrl: null,
        role,
        isEmailVerified: true,
        createdAt: pu.createdAt ? new Date(pu.createdAt).toISOString() : new Date().toISOString(),
        lastSignInAt: null,
        ordersCount: userOrders.count,
        totalSpent: Math.round(userOrders.totalSpent * 100) / 100,
        lastOrderDate: userOrders.lastOrder || null
      });
    }

    // Sort newest first
    unifiedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate executive KPIs
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const totalUsers = unifiedUsers.length;
    const totalCustomers = unifiedUsers.filter(u => u.role !== 'Admin').length;
    const totalAdmins = unifiedUsers.filter(u => u.role === 'Admin').length;
    const newThisWeek = unifiedUsers.filter(u => new Date(u.createdAt).getTime() >= sevenDaysAgo).length;

    const payload = {
      stats: {
        totalUsers,
        totalCustomers,
        totalAdmins,
        newThisWeek
      },
      users: unifiedUsers
    };

    // Cache admin users list for 20 seconds
    setCache(cacheKey, payload, 20);

    return NextResponse.json({
      success: true,
      ...payload
    });
  } catch (err: any) {
    console.error('[GET /api/admin/users] Critical error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Update user role (Promote to Admin / Set as Customer)
export async function PATCH(req: Request) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Store Owner clearance required.' }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = body;

    if (!email || !['Admin', 'Customer'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid email or role specified.' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Prevent demoting primary super owners
    const superOwners = [
      'abbasroghani869@gmail.com',
      'abbasroghani657@gmail.com',
      'drtoolofficial@gmail.com'
    ];
    if (role !== 'Admin' && superOwners.includes(lowerEmail)) {
      return NextResponse.json({ success: false, error: 'Cannot demote the primary store owner account.' }, { status: 400 });
    }

    // 1. Update in TiDB Prisma
    let updatedUser: any = null;
    try {
      updatedUser = await prisma.user.upsert({
        where: { email: lowerEmail },
        update: { role },
        create: {
          email: lowerEmail,
          name: email.split('@')[0],
          role
        }
      });
    } catch (dbErr) {
      console.error('[PATCH /api/admin/users] Prisma update error:', dbErr);
    }

    // 2. Sync to Clerk user metadata so Clerk session immediately contains Admin role
    try {
      const client = await clerkClient();
      const clerkUsersResponse = await client.users.getUserList({ emailAddress: [lowerEmail] });
      const clerkUsersList = (clerkUsersResponse as any).data || clerkUsersResponse || [];
      if (clerkUsersList.length > 0) {
        await client.users.updateUserMetadata(clerkUsersList[0].id, {
          publicMetadata: {
            role: role
          }
        });
      }
    } catch (clerkErr) {
      console.warn('[PATCH /api/admin/users] Clerk metadata sync warning:', clerkErr);
    }

    // Invalidate users list cache
    invalidateCache('admin_users_list');

    return NextResponse.json({ 
      success: true, 
      user: updatedUser || { email: lowerEmail, role },
      message: `Account ${lowerEmail} is now assigned the role of ${role}.` 
    });
  } catch (err: any) {
    console.error('[PATCH /api/admin/users] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error updating role' }, { status: 500 });
  }
}
