import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email found' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    const adminEmails = [
      'abbasroghani869@gmail.com',
      'drtoolofficial@gmail.com',
      process.env.ADMIN_EMAIL?.toLowerCase().trim()
    ].filter(Boolean);

    const isAdmin = adminEmails.includes(lowerEmail);

    // Lookup user in database
    let dbUser = await prisma.user.findUnique({
      where: { email: lowerEmail }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: lowerEmail,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || (isAdmin ? 'Zaheer Abbas' : 'User'),
          role: isAdmin ? 'Admin' : 'Customer'
        }
      });
    } else if (isAdmin && dbUser.role !== 'Admin') {
      dbUser = await prisma.user.update({
        where: { email: lowerEmail },
        data: { role: 'Admin' }
      });
    }

    return NextResponse.json({ success: true, role: dbUser.role });
  } catch (err: any) {
    console.error('[GET /api/auth/role]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
