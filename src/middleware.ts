import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/signin', '/setup', '/2fa'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for authentication token in cookies
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  // If user is logged in and tries to access signin, redirect them back
  if (pathname.startsWith('/signin') && accessToken && refreshToken) {
    const from = request.nextUrl.searchParams.get('from') || '/';
    return NextResponse.redirect(new URL(from, request.url));
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // If no token is found, redirect to sign in
  if (!accessToken || !refreshToken) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('from', pathname); 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 