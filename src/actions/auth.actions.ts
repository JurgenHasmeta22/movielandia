"use server";

import { hashSync } from "bcrypt";
import { User } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import RegistrationEmail from "../../emails/RegistrationEmail";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";
import NewsletterEmail from "../../emails/NewsletterEmail";

interface IRegister {
    email: string;
    password: string;
    userName: string;
}

interface IResetPassword {
    email: string;
}

interface INewsletterSubscribe {
    email: string;
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
                    // @ts-ignore
                    react: RegistrationEmail({ userName, email, token: token.token }),
                });

                redirect(`/register-verification-sent?email=${encodeURIComponent(email)}`);
            } else {
                throw new Error("Failed to register user.");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function resetPassword(userData: IResetPassword): Promise<any> {
    try {
        const { email } = userData;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            redirect("/register");
        }

        const token = await prisma.resetPasswordToken.create({
            data: {
                userId: user.id,
                token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
            },
        });

        await resend.emails.send({
            from: "MovieLandia24 <onboarding@resend.dev>",
            to: [email],
            subject: "Password Reset - Movielandia24",
            // @ts-ignore
            react: ResetPasswordEmail({ userName: user.userName, email, token: token.token }),
        });

        redirect(`/reset-password-verification-sent?email=${encodeURIComponent(email)}`);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function subscribeNewsletter(userData: INewsletterSubscribe): Promise<string> {
    try {
        const { email } = userData;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return "Email does not exist. Please ensure you have entered the correct email.";
        }

        if (user.subscribed) {
            return "You are already subscribed to the newsletter.";
        }

        await prisma.user.update({
            where: { email },
            data: { subscribed: true },
        });

        await resend.emails.send({
            from: "MovieLandia24 <onboarding@resend.dev>",
            to: email,
            subject: "MovieLandia24 Newsletter!",
            // @ts-ignore
            react: NewsletterEmail({ userName: user.userName }),
        });

        return "Subscription successful! Check your email for confirmation.";
    } catch (error) {
        return error instanceof Error ? error.message : "An unexpected error occurred.";
    }
}
