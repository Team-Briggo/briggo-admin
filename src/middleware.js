import { NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/login'];

// Routes that require authentication
const protectedRoutes = ['/creators', '/instagram-automations', '/credits'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check for Cognito tokens in cookies
  const hasAuthTokens = request.cookies.getAll().some(
    (cookie) => cookie.name.includes('CognitoIdentityServiceProvider')
  );

  // If trying to access login page while authenticated, redirect to admin
  if (publicRoutes.includes(pathname) && hasAuthTokens) {
    return NextResponse.redirect(new URL('/creators', request.url));
  }

  // If trying to access protected routes without auth, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !hasAuthTokens) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect root to creators page or login
  if (pathname === '/') {
    if (hasAuthTokens) {
      return NextResponse.redirect(new URL('/creators', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
