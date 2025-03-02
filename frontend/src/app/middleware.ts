// src/middlewares.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || localStorage.getItem('token'); // Sửa localStorage bằng cookies hoặc headers

  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/dashboard/:path*', '/booking', '/login'],
};





// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value || localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   const { pathname } = request.nextUrl;

//   if (pathname.startsWith('/dashboard/doctor') && role !== 'doctor') {
//     return NextResponse.redirect(new URL('/home', request.url));
//   }

//   if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
//     return NextResponse.redirect(new URL('/home', request.url));
//   }

//   if (pathname.startsWith('/booking') && role !== 'patient') {
//     return NextResponse.redirect(new URL('/home', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/booking', '/home'],
// };