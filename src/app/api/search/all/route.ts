import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const searchTerm = searchParams.get("term") || "";
        const take = 5;

        const [
            movies,
            moviesCount,
            series,
            seriesCount,
            actors,
            actorsCount,
            crews,
            crewsCount,
            seasons,
            seasonsCount,
            episodes,
            episodesCount,
            users,
            usersCount,
        ] = await Promise.all([
            prisma.movie.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.movie.count({
                where: { title: { contains: searchTerm } },
            }),
            prisma.serie.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.serie.count({
                where: { title: { contains: searchTerm } },
            }),
            prisma.actor.findMany({
                where: { fullname: { contains: searchTerm } },
                take,
            }),
            prisma.actor.count({
                where: { fullname: { contains: searchTerm } },
            }),
            prisma.crew.findMany({
                where: { fullname: { contains: searchTerm } },
                take,
            }),
            prisma.crew.count({
                where: { fullname: { contains: searchTerm } },
            }),
            prisma.season.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.season.count({
                where: { title: { contains: searchTerm } },
            }),
            prisma.episode.findMany({
                where: { title: { contains: searchTerm } },
                take,
            }),
            prisma.episode.count({
                where: { title: { contains: searchTerm } },
            }),
            prisma.user.findMany({
                where: { userName: { contains: searchTerm } },
                take,
            }),
            prisma.user.count({
                where: { userName: { contains: searchTerm } },
            }),
        ]);

        return NextResponse.json({
            movies: {
                items: movies,
                total: moviesCount,
            },
            series: {
                items: series,
                total: seriesCount,
            },
            actors: {
                items: actors,
                total: actorsCount,
            },
            crews: {
                items: crews,
                total: crewsCount,
            },
            seasons: {
                items: seasons,
                total: seasonsCount,
            },
            episodes: {
                items: episodes,
                total: episodesCount,
            },
            users: {
                items: users,
                total: usersCount,
            },
        });
    } catch (error) {
        console.error("Error searching:", error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}
