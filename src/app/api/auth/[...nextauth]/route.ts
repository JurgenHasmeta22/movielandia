import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "../../../../../prisma/config/prisma";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            // authorization: {
            //     params: {
            //         prompt: "consent",
            //         access_type: "offline",
            //         response_type: "code",
            //     },
            // },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (!user.active) {
                    throw new Error("User is not active. Please verify your email.");
                }

                const isPasswordValid = await compare(credentials.password, user.password!);

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
    // adapter: PrismaAdapter(prisma),
    callbacks: {
        // async signIn({ account, profile, user, credentials }) {
        //     console.log(account, profile, user, credentials);

        //     if (!profile?.email) {
        //         throw new Error("No profile found");
        //     }

        //     const existingUser = await prisma.user.findUnique({
        //         where: {
        //             email: profile.email,
        //         },
        //     });

        //     if (existingUser) {
        //         await prisma.user.update({
        //             where: {
        //                 email: profile.email,
        //             },
        //             data: {
        //                 userName: profile.name,
        //             },
        //         });
        //     } else {
        //         await prisma.user.create({
        //             data: {
        //                 email: profile.email,
        //                 userName: profile.name!,
        //                 active: true,
        //             },
        //         });
        //     }

        //     return true;
        // },

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
