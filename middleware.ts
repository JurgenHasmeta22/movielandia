import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (req.nextUrl.pathname.startsWith("/login")) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else if (req.nextUrl.pathname.startsWith("/register")) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
});

export const config = {
    matcher: ["/", "/login", "/register", "/profile"],
};
