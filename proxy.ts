import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) { 
    const { pathname } = req.nextUrl;
    const session = req.nextauth.token;

    if (pathname.startsWith('/admin')) {
      if (!session || session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/checkout/:path*',
    '/admin/:path*', 
    '/orders/:path*',
  ],
};
