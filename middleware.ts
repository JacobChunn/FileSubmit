// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
	//const token = await getToken({ req });
	//console.log(!!token)
	//console.log(token)
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token?.role);

    if (
      !req.nextauth.token ||
      (req.nextUrl.pathname.startsWith('/dashboard/employees') &&
        req.nextauth.token.role != 'admin')
    ) {
		console.log("DENIED!!!")
      return NextResponse.rewrite(new URL('/Denied', req.url));
    }
  },
  {
    callbacks: {
      authorized(token) {
		console.log("authorized?: ", !!token)
		console.log(token.token?.role); // Maybe i need to check if the token has stuff inside? Maybe stuff isnt being put inside token?
		  return !!token;
	  },
    },
  },
);

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  matcher: [
	'/dashboard/employees/',
	'/api/:path*"'
],
};
