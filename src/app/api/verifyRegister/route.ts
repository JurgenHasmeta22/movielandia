import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/config/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	if (!token || !email) {
		return NextResponse.json(
			{ message: "Invalid or missing token/email" },
			{ status: 400 },
		);
	}

	try {
		const activateToken = await prisma.activateToken.findFirst({
			where: {
				token,
				activatedAt: null,
			},
			include: {
				user: true,
			},
		});

		if (!activateToken || activateToken.user.email !== email) {
			return NextResponse.json(
				{ message: "Invalid token or email" },
				{ status: 400 },
			);
		}

		await prisma.user.update({
			where: { id: activateToken.userId },
			data: { active: true },
		});

		await prisma.activateToken.update({
			where: { id: activateToken.id },
			data: { activatedAt: new Date() },
		});

		return NextResponse.json({ message: "Email verified successfully." });
	} catch (error) {
		return NextResponse.json(
			{ message: "An error occurred during verification." },
			{ status: 500 },
		);
	}
}
