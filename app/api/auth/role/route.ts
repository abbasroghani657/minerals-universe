import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { ADMIN_EMAILS, MASTER_PASSKEYS } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', loggedIn: false }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email found', loggedIn: false }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    const allUserEmails = (user.emailAddresses || []).map(e => e.emailAddress.toLowerCase().trim());

    // 1. Immediate super-admin check from configured emails
    let isAdmin = allUserEmails.some(e => ADMIN_EMAILS.includes(e));
    let dbRole = isAdmin ? 'Admin' : 'Customer';
    let dbName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || (isAdmin ? 'Zaheer Abbas' : 'User');

    // 2. Safe Database sync (non-blocking if DB has latency)
    try {
      let dbUser = await prisma.user.findFirst({
        where: { email: { in: allUserEmails } }
      });

      if (dbUser && dbUser.role === 'Admin') {
        isAdmin = true;
        dbRole = 'Admin';
      }

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: lowerEmail,
            name: dbName,
            role: isAdmin ? 'Admin' : 'Customer'
          }
        });
      } else if (isAdmin && dbUser.role !== 'Admin') {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: 'Admin' }
        });
      }
      if (dbUser?.name) dbName = dbUser.name;
    } catch (dbErr) {
      console.warn('[GET /api/auth/role] Non-fatal DB sync warning:', dbErr);
    }

    return NextResponse.json({ 
      success: true, 
      role: isAdmin ? 'Admin' : dbRole, 
      email: lowerEmail, 
      name: dbName,
      loggedIn: true,
      isAdmin: isAdmin
    });
  } catch (err: any) {
    console.error('[GET /api/auth/role]', err);
    return NextResponse.json({ success: false, error: err.message, loggedIn: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Please sign in first before unlocking Admin privileges' }, { status: 401 });
    }

    const { passkey } = await req.json().catch(() => ({}));
    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email found on your account' }, { status: 400 });
    }

    // Check passkey against authorized master owner passkeys
    if (MASTER_PASSKEYS.includes(passkey?.trim())) {
      let updatedUser;
      try {
        updatedUser = await prisma.user.upsert({
          where: { email },
          update: { role: 'Admin' },
          create: {
            email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Zaheer Abbas (Admin)',
            role: 'Admin'
          }
        });
      } catch (e) {
        // Fallback in-memory
      }

      return NextResponse.json({ 
        success: true, 
        role: 'Admin', 
        email: updatedUser?.email || email,
        message: 'Owner privileges granted successfully! You are now an Administrator.' 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid master passkey. Please check the secret key.' }, { status: 403 });
  } catch (err: any) {
    console.error('[POST /api/auth/role]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
