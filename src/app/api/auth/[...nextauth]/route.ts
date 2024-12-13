import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "../../../../../prisma/config/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user?.password) {
                    throw new Error("Invalid credentials");
                }

                if (!user.active) {
                    throw new Error("Please activate your account first");
                }

                const dbPassword = user.password!;
                let isPasswordValid = false;

                // Checking if the password in the database is hashed
                const isHashedPassword = dbPassword.length === 60 && dbPassword.startsWith("$2b$");

                if (isHashedPassword) {
                    // Comparing using bcrypt for hashed passwords
                    isPasswordValid = await compare(credentials.password, dbPassword);
                } else {
                    // Plain text comparison for unencrypted passwords
                    isPasswordValid = credentials.password === dbPassword;
                }

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
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
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: profile?.email },
                    include: { accounts: true },
                });

                if (!existingUser) {
                    // Creating a new user if doesn't exist for google auth0
                    const newUser = await prisma.user.create({
                        data: {
                            email: profile?.email,
                            userName: profile?.name ?? "Google User",
                            active: true,
                            role: "User",
                        },
                    });

                    // Create the account link, this is the most important which fixed it
                    await prisma.account.create({
                        data: {
                            userId: newUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                        },
                    });

                    return true;
                }

                // If user exists but no account is linked, link the account
                if (existingUser && !existingUser.accounts.length) {
                    await prisma.account.create({
                        data: {
                            userId: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                        },
                    });
                }

                return true;
            }

            return true;
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "google") {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                });

                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.userName = dbUser.userName;
                    token.role = dbUser.role;
                }
            }

            if (user) {
                token.id = user.id;
                token.userName = user.userName;
                token.role = user.role;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.userName = token.userName as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
