import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect the admin panel and the checkout screens
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/checkout(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
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
