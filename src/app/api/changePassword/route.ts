import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/config/prisma";
import { hashSync } from "bcrypt";

export async function POST(request: Request) {
    const { newPassword, email } = await request.json();

    if (!email || !newPassword) {
        return NextResponse.json({ message: "Invalid or missing email or password" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User with that email doesn't exist." }, { status: 400 });
        }

        if (!user.canResetPassword) {
            return NextResponse.json(
                {
                    message:
                        "You are not permitted to change the password without the verification process beforehand.",
                },
                { status: 400 },
            );
        }

        const saltRounds = 7;
        const hashedPassword = hashSync(newPassword, saltRounds);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, canResetPassword: false },
        });

        return NextResponse.json({ message: "Password is changed successfully." });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred during changing the password." }, { status: 500 });
    }
}
