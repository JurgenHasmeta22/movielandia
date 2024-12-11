import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const searchTerm = searchParams.get("term") || "";
        const page = 1;
        const take = 10;

        const [movies, series, actors, crews, seasons, episodes, users] = await Promise.all([
            prisma.movie.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.serie.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.actor.findMany({
                where: { fullname: { contains: searchTerm } },
                take,
            }),
            prisma.crew.findMany({
                where: { fullname: { contains: searchTerm } },
                take,
            }),
            prisma.season.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.episode.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.user.findMany({
                where: { userName: { contains: searchTerm } },
                take,
            }),
        ]);

        return NextResponse.json({
            movies,
            series,
            actors,
            crews,
            seasons,
            episodes,
            users,
        });
    } catch (error) {
        console.error("Error searching:", error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}
