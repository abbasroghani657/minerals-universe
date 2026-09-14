import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Match automated scanner honeypots & predictable admin paths
const isHoneypotProbe = createRouteMatcher([
  '/admin(.*)',
  '/wp-admin(.*)',
  '/administrator(.*)',
  '/backend(.*)',
  '/cpanel(.*)',
  '/user/admin(.*)',
]);

// Match the secret executive vault management route
const isExecutiveVault = createRouteMatcher(['/executive-vault(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Trap automated scanners and hackers attempting to probe standard admin paths
  // Rewrite to native 404 (Not Found) decoy - Zero information disclosure
  if (isHoneypotProbe(req)) {
    return NextResponse.rewrite(new URL('/_not-found', req.url));
  }

  // 2. Zero-Knowledge Stealth Defense for /executive-vault
  // If an unauthenticated user or bot visits the stealth path, DO NOT redirect to login (which proves existence).
  // Instead, immediately rewrite to 404 Not Found so the scanner assumes it doesn't exist.
  if (isExecutiveVault(req)) {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.rewrite(new URL('/_not-found', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
