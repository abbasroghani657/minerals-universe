import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function getAdminEmails() {
  return [
    'abbasroghani869@gmail.com',
    'abbasroghani657@gmail.com',
    'drtoolofficial@gmail.com',
    '22pwbcs0904@uetpeshawar.edu.pk',
    process.env.ADMIN_EMAIL?.toLowerCase().trim()
  ].filter(Boolean) as string[];
}

// Check if requester is Admin
async function verifyAdmin() {
  const user = await currentUser();
  if (!user) return null;
  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
  if (!email) return null;

  const adminEmails = getAdminEmails();
  if (adminEmails.includes(email)) return { user, email, isAdmin: true };

  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (dbUser?.role === 'Admin') return { user, email, isAdmin: true };

  return null;
}

export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const adminEmails = getAdminEmails();

    // 1. Fetch users from Prisma
    let prismaUsers: any[] = [];
    try {
      prismaUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (err) {
      console.error('[GET /api/admin/users] Prisma fetch error:', err);
    }

    // 2. Fetch users from Clerk
    let clerkUsers: any[] = [];
    try {
      const client = await clerkClient();
      const response = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });
      // Clerk v5/v6/v7 data structure compatibility
      clerkUsers = (response as any).data || response || [];
    } catch (err) {
      console.error('[GET /api/admin/users] Clerk fetch error:', err);
    }

    // 3. Aggregate Orders per email
    const orderStats = new Map<string, { count: number; totalSpent: number; lastOrder: string }>();
    try {
      const orders = await prisma.order.findMany({
        select: {
          customerEmail: true,
          total: true,
          status: true,
          createdAt: true
        }
      });
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
    } catch (err) {
      console.error('[GET /api/admin/users] Order stats error:', err);
    }

    // 4. Map & Sync users
    const prismaByEmail = new Map<string, any>();
    prismaUsers.forEach(u => {
      if (u.email) prismaByEmail.set(u.email.toLowerCase().trim(), u);
    });

    const unifiedUsers: any[] = [];
    const seenEmails = new Set<string>();

    // Process Clerk users first
    for (const cu of clerkUsers) {
      const primaryEmailObj = cu.emailAddresses?.find((e: any) => e.id === cu.primaryEmailAddressId) || cu.emailAddresses?.[0];
      const email = (primaryEmailObj?.emailAddress || '').toLowerCase().trim();
      if (!email) continue;
      seenEmails.add(email);

      const fullName = [cu.firstName, cu.lastName].filter(Boolean).join(' ').trim() || cu.username || email.split('@')[0];
      const isConfigAdmin = adminEmails.includes(email);
      let dbUser = prismaByEmail.get(email);

      // Auto sync into Prisma if missing
      if (!dbUser) {
        try {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: fullName,
              role: isConfigAdmin ? 'Admin' : 'Customer',
              createdAt: cu.createdAt ? new Date(cu.createdAt) : new Date()
            }
          });
          prismaByEmail.set(email, dbUser);
        } catch (e) {
          // ignore duplicate race condition
        }
      }

      const role = isConfigAdmin ? 'Admin' : (dbUser?.role || 'Customer');
      const orders = orderStats.get(email) || { count: 0, totalSpent: 0, lastOrder: '' };

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
        ordersCount: orders.count,
        totalSpent: Math.round(orders.totalSpent * 100) / 100,
        lastOrderDate: orders.lastOrder || null
      });
    }

    // Include any Prisma-only users
    for (const pu of prismaUsers) {
      const email = (pu.email || '').toLowerCase().trim();
      if (!email || seenEmails.has(email)) continue;
      seenEmails.add(email);

      const isConfigAdmin = adminEmails.includes(email);
      const role = isConfigAdmin ? 'Admin' : (pu.role || 'Customer');
      const orders = orderStats.get(email) || { count: 0, totalSpent: 0, lastOrder: '' };

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
        ordersCount: orders.count,
        totalSpent: Math.round(orders.totalSpent * 100) / 100,
        lastOrderDate: orders.lastOrder || null
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

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalAdmins,
        newThisWeek
      },
      users: unifiedUsers
    });
  } catch (err: any) {
    console.error('[GET /api/admin/users] Critical error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Update user role (Promote to Admin / Set as Customer)
export async function PATCH(req: Request) {
  try {
    const auth = await verifyAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = body;

    if (!email || !['Admin', 'Customer'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid email or role' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    const adminEmails = getAdminEmails();

    // Prevent removing super-admins from admin
    if (role !== 'Admin' && (lowerEmail === 'abbasroghani869@gmail.com' || lowerEmail === 'abbasroghani657@gmail.com' || lowerEmail === 'drtoolofficial@gmail.com')) {
      return NextResponse.json({ success: false, error: 'Cannot demote the primary store owner account.' }, { status: 400 });
    }

    // Update in Prisma
    const updated = await prisma.user.upsert({
      where: { email: lowerEmail },
      update: { role },
      create: {
        email: lowerEmail,
        name: email.split('@')[0],
        role
      }
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error('[PATCH /api/admin/users] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
