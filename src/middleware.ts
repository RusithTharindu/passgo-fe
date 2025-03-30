// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { TOKEN_KEY } from './utils/helpers/cookieStorage';
// import Cookies from "js-cookie";
// import { decode, JwtPayload } from 'jsonwebtoken'

// export function middleware(request: NextRequest) {
//   // const token = request.cookies.get(TOKEN_KEY);
//   const token = Cookies.get("token");

//   // Define auth pages (login and signup)
//   const isAuthPage =
//     request.nextUrl.pathname === '/login' ||
//     request.nextUrl.pathname === '/signup';

//   // Define protected pages that require authentication
//   const isProtectedPage =
//     request.nextUrl.pathname.startsWith('/dashboard') ||
//     request.nextUrl.pathname.startsWith('/profile') ||
//     request.nextUrl.pathname.startsWith('/application');

//   // If accessing protected page without token, redirect to login
//   if (isProtectedPage && !token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // If accessing auth page with token, redirect to dashboard
//   if (isAuthPage && token) {
//     const decodedToken = decode(token) as JwtPayload;
//     const role = decodedToken.role;
//     if (role === "admin") {
//       return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//     } else if (role === "applicant") {
//       return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
//     } else {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//     // return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// // Configure which routes use this middleware
// export const config = {
//   matcher: ['/login', '/signup', '/dashboard/:path*', '/profile/:path*', '/application/:path*'],
// };

export function middleware() {}
