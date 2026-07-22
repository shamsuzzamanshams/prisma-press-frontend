import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtUtils } from './utils/jwt';
import { AwardIcon } from 'lucide-react';
import { cookies } from 'next/headers';

// This function can be marked `async` if using `await` inside

const AUTH_ROUTE = ["/login", "/register"];
const PUBLIC_ROUTE = ["/", "/new"];
export async function proxy(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	// console.log(request.nextUrl, "Requst");
	// console.log(pathName, "pathName");

	const cookieStore = await cookies();


	// console.log("Proxy");

	const accessToken = request.cookies.get("accessToken")?.value

	const decodedToken = accessToken ? jwtUtils.verifiToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null

	let userRole = null;

	if(!decodedToken?.success){
		cookieStore.delete("accessToken");
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (decodedToken?.success && decodedToken.data) {
		userRole = (decodedToken.data as JwtPayload).role;
	}

	if (accessToken && AUTH_ROUTE.includes(pathName)) {
		if (userRole === "USER") {
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}
		else if (userRole === "ADMIN") {
			return NextResponse.redirect(new URL('/admin-dashboard', request.url))
		}
		else if (userRole === "AUTHOR") {
			return NextResponse.redirect(new URL('/author-dashboard', request.url))
		}
		else {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	const isPublic = PUBLIC_ROUTE.some((route) => pathName === route || pathName.startsWith(route + "/"));

	const isAuth = AUTH_ROUTE.some((route) => pathName === route || pathName.startsWith(route + "/"));

	if (!accessToken && !isPublic && !isAuth) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (pathName.startsWith("/dashboard") && userRole !== "USER") {
		return NextResponse.redirect(new URL('/not-found', request.url));
	}
	else if (pathName.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
		return NextResponse.redirect(new URL('/not-found', request.url));
	}
	else if (pathName.startsWith("/author-dashboard") && userRole !== "AUTHOR") {
		return NextResponse.redirect(new URL('/not-found', request.url));
	}
	// return NextResponse.redirect(new URL('/', request.url))
	return NextResponse.next();


}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
	matcher: [
		// '/dashboard/:path*',
		// '/admin-dashboard/:path*',
		'/((?!api|_next/static|_next/image|.*\\.png$).*)'
	],
}