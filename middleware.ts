import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Stealth keys that allow owner to access the admin entry point
const STEALTH_KEYS = ['mu2026', 'MineralsOwner2026!', 'PakistanZindabad2026'];

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId } = await auth();

    // 1. If user is already authenticated with Clerk, allow through to admin layout
    // The layout will verify their specific role in the database.
    if (userId) {
      return NextResponse.next();
    }

    // 2. If unauthenticated, check for stealth bypass key or cookie
    const url = req.nextUrl;
    const queryKey = url.searchParams.get('key') || url.searchParams.get('secret');
    const stealthCookie = req.cookies.get('mu_stealth_auth')?.value;

    const hasValidKey = (queryKey && STEALTH_KEYS.includes(queryKey.trim())) || stealthCookie === 'verified_owner';

    if (hasValidKey) {
      // Allow owner to proceed to sign in, preserving a stealth cookie
      const redirectUrl = new URL('/sign-in', req.url);
      redirectUrl.searchParams.set('redirect_url', '/admin');
      const res = NextResponse.redirect(redirectUrl);
      res.cookies.set('mu_stealth_auth', 'verified_owner', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'lax',
      });
      return res;
    }

    // 3. Stealth Mode Defense:
    // Unauthorized scanners, crawlers, or strangers typing "/admin" are silently redirected
    // to the public storefront home page (/) with zero indication that an admin route exists.
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
