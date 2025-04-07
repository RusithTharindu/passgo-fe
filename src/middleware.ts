import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_KEY } from './utils/helpers/cookieStorage';
import { decode, JwtPayload } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const pathname = request.nextUrl.pathname;

  // Auth pages that don't require authentication
  const isAuthPage = ['/login', '/signup'].includes(pathname);

  // Public pages accessible to everyone
  const isPublicPage = ['/', '/about', '/contact'].some(
    path => pathname === path || pathname.startsWith('/api/'),
  );

  // If no token and trying to access a protected page, redirect to login
  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists
  if (token) {
    try {
      // Decode token to get user role
      const decodedToken = decode(token) as JwtPayload;
      const role = decodedToken.role as string;

      // If user is on auth pages with valid token, redirect based on role
      if (isAuthPage) {
        if (role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (role === 'applicant') {
          return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
        }
      }

      // Role-based access control
      if (pathname.startsWith('/admin') && role !== 'admin') {
        // Non-admins trying to access admin routes
        if (role === 'applicant') {
          return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }

      if (pathname.startsWith('/applicant') && role !== 'applicant') {
        // Non-applicants trying to access applicant routes
        if (role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(TOKEN_KEY);
      console.error('Token validation error:', error);
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
