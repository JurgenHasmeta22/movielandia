"use server";

import { hashSync } from "bcrypt";
import { User } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import RegistrationEmail from "../../emails/RegistrationEmail";

interface IRegister {
    email: string;
    password: string;
    userName: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signUp(userData: IRegister): Promise<User | null | undefined> {
    try {
        const { email, password, userName } = userData;

        const existingUser: User | null = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists.");
        } else {
            const hash = hashSync(password, 7);

            const user: User | null = await prisma.user.create({
                data: { email, password: hash, userName, active: false },
            });

            const token = await prisma.activateToken.create({
                data: {
                    userId: user.id,
                    token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
                },
            });

            if (user && token) {
                await resend.emails.send({
                    from: "MovieLandia24 <onboarding@resend.dev>",
                    to: [email],
                    subject: "Registration Verification - Movielandia24",
                    react: RegistrationEmail({ userName, email, token: token.token }),
                });

                redirect(`/verification-sent?email=${encodeURIComponent(email)}`);
            } else {
                throw new Error("Failed to register user.");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}
