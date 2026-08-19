import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'love-admin-super-secret-key-32chars-min',
  });

  const isAuthPage = pathname.startsWith('/login');
  const isPublicPage =
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname === '/about' ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/about');

  // If user is accessing public informational pages, allow
  if (isPublicPage) {
    return NextResponse.next();
  }

  // If user is logged in and tries to access login page, redirect to home
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // If user is not logged in and tries to access protected pages, redirect to /login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, public assets
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|icons.svg|assets).*)',
  ],
};
