import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/config/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
        return NextResponse.json({ message: "Invalid or missing token/email" }, { status: 400 });
    }

    try {
        const resetPasswordToken = await prisma.resetPasswordToken.findFirst({
            where: {
                token,
                resetPasswordAt: null,
            },
            include: {
                user: true,
            },
        });

        if (!resetPasswordToken || resetPasswordToken.user.email !== email) {
            return NextResponse.json({ message: "Invalid token or email" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: resetPasswordToken.userId },
            data: { canResetPassword: true },
        });

        await prisma.resetPasswordToken.update({
            where: { id: resetPasswordToken.id },
            data: { resetPasswordAt: new Date() },
        });

        return NextResponse.json({ message: "Reset password with email verified successfully." });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred during verification." }, { status: 500 });
    }
}
