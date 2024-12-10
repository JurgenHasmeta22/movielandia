import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userName = searchParams.get("userName") || "";
        const page = Number(searchParams.get("page")) || 1;
        const sortBy = searchParams.get("sortBy") || undefined;
        const ascOrDesc = searchParams.get("ascOrDesc") as "asc" | "desc" | undefined;

        const orderByObject: any = {};
        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const query = {
            where: {
                userName: { contains: userName },
            },
            orderBy: orderByObject,
            skip: (page - 1) * 12,
            take: 12,
        };

        const users = await prisma.user.findMany(query);
        const count = await prisma.user.count({
            where: {
                userName: { contains: userName },
            },
        });

        return NextResponse.json({ users, count });
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
    }
} 