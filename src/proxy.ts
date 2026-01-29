import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
	const token = await getToken({ req });
	const isAuthenticated = !!token;
	const userRole = token?.role;

	if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (req.nextUrl.pathname.startsWith("/register") && isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (req.nextUrl.pathname.startsWith("/users") && !isAuthenticated) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (req.nextUrl.pathname.startsWith("/users") && userRole === "Admin") {
		return NextResponse.redirect(new URL("/admin", req.url));
	}

	if (
		req.nextUrl.pathname.startsWith("/admin") &&
		(!isAuthenticated || userRole !== "Admin")
	) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (req.nextUrl.pathname.startsWith("/notifications") && !isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (req.nextUrl.pathname.startsWith("/messages") && !isAuthenticated) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/login",
		"/register",
		"/users/:path*",
		"/admin/:path*",
		"/notifications",
		"/messages/:path",
	],
};
