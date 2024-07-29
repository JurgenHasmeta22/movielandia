import NextAuth, { type NextAuthOptions } from "next-auth";
// eslint-disable-next-line import/no-named-as-default
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    userName: user.userName,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.userName = user.userName;
                token.email = user.email;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id;
                session.user.userName = token.userName;
                session.user.email = token.email;
                session.user.role = token.role;
            }

            return session;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
