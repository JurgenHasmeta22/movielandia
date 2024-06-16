import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        console.log("Inter");

        if (
            request.nextUrl.pathname.startsWith("/login") ||
            (request.nextUrl.pathname.startsWith("/register") && request.nextauth.token)
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (request.nextUrl.pathname.startsWith("/profile") && !request.nextauth.token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    },
);

export const config = { matcher: ["/login", "/register", "/"] };
