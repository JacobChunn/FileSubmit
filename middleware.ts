// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { CustomUser } from './app/lib/definitions';
import { input } from '@material-tailwind/react';

// https://github.com/TusharVashishth/Nextjs_Authentication/blob/main/src/middleware.ts

export async function middleware(req: NextRequest) {

	const landingPageRoute = [
		"/", // just the landing page
	];

	const unprotectedBeginningRoutes = [
		"/favicon.ico",
		"/_next/static",
		"/_next/image",
		"/api/auth"
	];

	const adminProtectedRoutes = ["/fakeAdminPath"];

	//console.log("middleware is here");

	const { pathname } = req.nextUrl;
	//console.log("PATHNAME: ", pathname)
	// console.log(req.url)
	// console.log(pathname);

	if (pathname == "/api/auth/signin") {
		//console.log("signin page!")
		return NextResponse.next();
	}

	const token = await getToken({ req });

	// console.log({
	// 	msg: "Middleware Result",
	// 	token: token,
	// });

	if (token == null) {
		//console.log("NO TOKEN!!!!!!!")
		if (
			!(landingPageRoute.includes(pathname) ||
			pathnameBeginsWithAny(pathname, unprotectedBeginningRoutes))
		) {
			//console.log("NO TOKEN BLOCKED: ", pathname);
			return NextResponse.redirect(
				new URL(
					"/api/auth/signin", req.url
				)
				//addCallbackURL("/api/auth/signin", req.url, req.url)
			);
		}
		else {
			//console.log("NO TOKEN ALLOWED: ", pathname);
			return NextResponse.next();
		}
	}

	// Is signed in, and trying to access landing page
	if (
		landingPageRoute.includes(pathname)
	) {
		//console.log("IN SECOND")
		return NextResponse.redirect(
			new URL(
				"/dashboard", req.url
			)
		);
	}

	//   * Get user from token
	const user: CustomUser["role"] = token.role;

	// * if user try to access admin routes
	if (adminProtectedRoutes.includes(pathname) && user == "normalUser") {
		return NextResponse.redirect(
			new URL(
				"/dashboard/denied?error=Not+Admin",
				req.url
			)
		);
	}

	//console.log("END OF CHECKS!!!")
	return NextResponse.next();
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

function addCallbackURL(pathname: string, base:string, callbackURL: string) {
	const inputURL = new URL (pathname, base);
	inputURL.searchParams.set('callbackURL', callbackURL);
	//console.log("Callback Added: ", inputURL.toString())
	return inputURL;
}

function pathnameBeginsWithAny(pathname: string, routeBeginnings: string[]) {
	for (let prefix of routeBeginnings) {
		if (pathname.startsWith(prefix)) {
			return true;
		}
	}
	return false;
}

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
//   matcher: [
// 	'/dashboard/employees/',
// 	'/api/:path*"'
// ],
// };
