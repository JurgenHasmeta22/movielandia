import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/config/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
        return NextResponse.redirect("/error");
    }

    const userToken = await prisma.activateToken.findFirst({
        where: { token, user: { email } },
    });

    if (!userToken) {
        return NextResponse.redirect("/error");
    }

    await prisma.user.update({
        where: { id: userToken.userId },
        data: { active: true },
    });

    await prisma.activateToken.delete({
        where: { id: userToken.id },
    });

    return NextResponse.redirect("/login");
}
