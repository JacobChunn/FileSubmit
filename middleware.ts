// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { CustomUser } from './app/lib/definitions';

// https://github.com/TusharVashishth/Nextjs_Authentication/blob/main/src/middleware.ts

  export async function middleware(req: NextRequest) {

    console.log("middleware is here");

    const { pathname } = req.nextUrl;
    console.log(pathname);

    if (pathname == "/api/auth/signin") {
      console.log("signin page!")
      return NextResponse.next();
    }

    const token = await getToken({ req });

    const userProtectedRoutes = ["/"];

    const adminProtectedRoutes = ["/admin/dashboard"];

    if (
      token == null &&
      (userProtectedRoutes.includes(pathname) ||
        adminProtectedRoutes.includes(pathname))
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/denied", req.url
        )
      );
    }

    //   * Get user from token
  const user: CustomUser = token?.user as CustomUser;

  // * if user try to access admin routes
  if (adminProtectedRoutes.includes(pathname) && user.role == "User") {
    return NextResponse.redirect(
      new URL(
        "/admin/login?error=Please login first to access this route.",
        request.url
      )
    );
  }

  //   * If Admin try to access user routes
  if (userProtectedRoutes.includes(pathname) && user.role == "Admin") {
    return NextResponse.redirect(
      new URL(
        "/login?error=Please login first to access this route.",
        request.url
      )
    );
  }

    //console.log(req.nextauth.token?.role);

    // if (
    //   !req.nextauth.token ||
    //   (req.nextUrl.pathname.startsWith('/dashboard/employees') &&
    //     req.nextauth.token.role != 'admin')
    // ) {
		// console.log("DENIED!!!")
    //   return NextResponse.rewrite(new URL('/dashboard/denied', req.url));
    // }
  }

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
//   matcher: [
// 	'/dashboard/employees/',
// 	'/api/:path*"'
// ],
// };
