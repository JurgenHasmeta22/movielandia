import NextAuth from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            email: string;
            userName: string;
            role: string;
        };
    }

    interface User {
        id: string;
        email: string;
        userName: string;
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        userName: string;
        role: string;
    }
}
