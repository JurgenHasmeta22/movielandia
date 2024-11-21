import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";

// This middleware logic basically is to prevent to access certain pages if not loggedIn
export default async function middleware(req: NextRequestWithAuth, event: NextFetchEvent) {
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

    // Prevent admin from accessing user profile
    if (req.nextUrl.pathname.startsWith("/users") && userRole === "Admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/admin") && (!isAuthenticated || userRole !== "Admin")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const authMiddleware = await withAuth({
        pages: {
            signIn: req.nextUrl.pathname,
        },
    });

    return authMiddleware(req, event);
}

export const config = {
    matcher: ["/login", "/register", "/users/:path*", "/admin/:path*"],
};
