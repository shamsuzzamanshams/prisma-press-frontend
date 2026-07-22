import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"

// This function can be marked `async` if using `await` inside

const AUTH_ROUTE = ["/login", "/register"]
export async function proxy(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	console.log(request.nextUrl, "Requst");
	console.log(pathName, "pathName");


	console.log("Proxy");

	const accessToken = request.cookies.get("accessToken")?.value

	const decodedToken = accessToken ? jwt.decode(accessToken) as JwtPayload : null

	let userRole = null;

	if (decodedToken) {
		userRole = decodedToken.role;
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
		else{
			return NextResponse.redirect(new URL('/', request.url))
		}
	}
	// return NextResponse.redirect(new URL('/', request.url))
	return NextResponse.next()


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