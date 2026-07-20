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

    // Lookup user in database
    let dbUser = await prisma.user.findUnique({
      where: { email }
    });

    // If new user, create their database record with the default 'Customer' role
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          role: 'Customer'
        }
      });
    }

    return NextResponse.json({ success: true, role: dbUser.role });
  } catch (err: any) {
    console.error('[GET /api/auth/role]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
