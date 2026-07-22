import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JwtPayload } from "jsonwebtoken"
import { jwtUtils } from './utils/jwt';
import { cookies } from 'next/headers';
import { getNewAccessToken } from './service/refreshToken';

// This function can be marked `async` if using `await` inside

const AUTH_ROUTE = ["/login", "/register"];
const PUBLIC_ROUTE = ["/", "/new"];
export async function proxy(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	// console.log(request.nextUrl, "Requst");
	// console.log(pathName, "pathName");

	const cookieStore = await cookies();


	// console.log("Proxy");

	let accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	let decodedAccessToken = accessToken ? jwtUtils.verifiToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null
	const decodedRefreshToken = refreshToken ? jwtUtils.verifiToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null

	if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
		const result = await getNewAccessToken();

		if (result.success) {
			const newAccessToken = result.data.accessToken;

			cookieStore.set("accessToken", newAccessToken, {
				httpOnly: true,
				maxAge: 60 * 60 * 24,
				sameSite: "lax"
			});
			accessToken = newAccessToken;
			decodedAccessToken = jwtUtils.verifiToken(accessToken!, process.env.JWT_ACCESS_SECRET as string)

		}


	}

	let userRole = null;

	if (!decodedAccessToken?.success) {
		cookieStore.delete("accessToken");
		// return NextResponse.redirect(new URL('/login', request.url));
	}

	if (decodedAccessToken?.success && decodedAccessToken.data) {
		userRole = (decodedAccessToken.data as JwtPayload).role;
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