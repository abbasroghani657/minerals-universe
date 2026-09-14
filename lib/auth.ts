import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const ADMIN_EMAILS: string[] = [
  'abbasroghani869@gmail.com',
  'abbasroghani657@gmail.com',
  'drtoolofficial@gmail.com',
  '22pwbcs0904@uetpeshawar.edu.pk',
  process.env.ADMIN_EMAIL?.toLowerCase().trim(),
].filter(Boolean) as string[];

export const MASTER_PASSKEYS: string[] = [
  'MineralsOwner2026!',
  'mu2026',
  'PakistanZindabad2026',
  process.env.ADMIN_SECRET_KEY?.trim(),
].filter(Boolean) as string[];

export interface AdminAuthResult {
  authorized: boolean;
  email?: string;
  name?: string;
  user?: any;
  reason?: string;
}

/**
 * Robust server-side verification for Admin-protected routes and mutations.
 * Validates via Clerk session, database role, or master key.
 */
export async function verifyAdminRequest(req?: Request): Promise<AdminAuthResult> {
  try {
    // 1. Check direct master key header (for emergency/automated admin access)
    if (req) {
      const headerKey = req.headers.get('x-admin-key') || req.headers.get('authorization')?.replace('Bearer ', '');
      if (headerKey && MASTER_PASSKEYS.includes(headerKey.trim())) {
        return { authorized: true, email: 'master@mineralsuniverse.com', name: 'Master Owner' };
      }
    }

    // 2. Check authenticated Clerk session
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { authorized: false, reason: 'Unauthenticated: No active session' };
    }

    const allEmails = (clerkUser.emailAddresses || [])
      .map(e => e.emailAddress?.toLowerCase().trim())
      .filter(Boolean);

    if (allEmails.length === 0) {
      return { authorized: false, reason: 'No verified email found' };
    }

    const primaryEmail = allEmails[0];

    // 3. Fast check: is user in hardcoded super-admin list?
    const isHardcodedAdmin = allEmails.some(e => ADMIN_EMAILS.includes(e));
    if (isHardcodedAdmin) {
      // Ensure database user also reflects Admin role
      try {
        await prisma.user.upsert({
          where: { email: primaryEmail },
          update: { role: 'Admin' },
          create: {
            email: primaryEmail,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Zaheer Abbas (Admin)',
            role: 'Admin',
          },
        });
      } catch (e) {
        // silent catch
      }

      return {
        authorized: true,
        email: primaryEmail,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Zaheer Abbas',
      };
    }

    // 3b. Check Clerk publicMetadata for assigned Admin role
    if ((clerkUser.publicMetadata as any)?.role === 'Admin') {
      return {
        authorized: true,
        email: primaryEmail,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Store Admin',
      };
    }

    // 4. Database check: lookup user role in TiDB
    const dbUser = await prisma.user.findFirst({
      where: { email: { in: allEmails } },
    });

    if (dbUser && dbUser.role === 'Admin') {
      return {
        authorized: true,
        email: dbUser.email,
        name: dbUser.name || 'Store Admin',
        user: dbUser,
      };
    }

    return { authorized: false, email: primaryEmail, reason: 'Forbidden: Account does not have Admin clearance' };
  } catch (err: any) {
    console.error('[verifyAdminRequest] Error:', err);
    return { authorized: false, reason: err.message || 'Internal authorization error' };
  }
}
