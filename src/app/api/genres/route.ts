import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const genres = await prisma.genre.findMany();

        if (genres) {
            return NextResponse.json(genres, { status: 200 });
        }
    } catch (err) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
