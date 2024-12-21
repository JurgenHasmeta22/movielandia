import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const searchTerm = searchParams.get("term")?.trim() || "";

        if (!searchTerm) {
            return NextResponse.json({});
        }

        const filters = searchParams.get("filters")?.split(",") || [];
        const take = 5;

        // If "all" is selected or no filters specified, search all categories
        const shouldSearchAll = filters.includes("all") || filters.length === 0;

        const queries = [];
        if (shouldSearchAll || filters.includes("movies")) {
            queries.push(
                prisma.movie.findMany({ where: { title: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.movie.count({ where: { title: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        if (shouldSearchAll || filters.includes("series")) {
            queries.push(
                prisma.serie.findMany({ where: { title: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.serie.count({ where: { title: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        if (shouldSearchAll || filters.includes("actors")) {
            queries.push(
                prisma.actor.findMany({ where: { fullname: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.actor.count({ where: { fullname: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        if (shouldSearchAll || filters.includes("crew")) {
            queries.push(
                prisma.crew.findMany({ where: { fullname: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.crew.count({ where: { fullname: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        if (shouldSearchAll || filters.includes("seasons")) {
            queries.push(
                prisma.season.findMany({ where: { title: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.season.count({ where: { title: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        if (shouldSearchAll || filters.includes("episodes")) {
            queries.push(
                prisma.episode.findMany({ where: { title: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.episode.count({ where: { title: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        if (shouldSearchAll || filters.includes("users")) {
            queries.push(
                prisma.user.findMany({ where: { userName: { contains: searchTerm, mode: "insensitive" } }, take }),
                prisma.user.count({ where: { userName: { contains: searchTerm, mode: "insensitive" } } }),
            );
        }

        const results = await Promise.all(queries);
        const response: any = {};
        let resultIndex = 0;

        // Processing results based on the same order as queries
        if (shouldSearchAll || filters.includes("movies")) {
            response.movies = { items: results[resultIndex], total: results[resultIndex + 1] };
            resultIndex += 2;
        }

        if (shouldSearchAll || filters.includes("series")) {
            response.series = { items: results[resultIndex], total: results[resultIndex + 1] };
            resultIndex += 2;
        }

        if (shouldSearchAll || filters.includes("actors")) {
            response.actors = { items: results[resultIndex], total: results[resultIndex + 1] };
            resultIndex += 2;
        }

        if (shouldSearchAll || filters.includes("crew")) {
            response.crews = { items: results[resultIndex], total: results[resultIndex + 1] };
            resultIndex += 2;
        }

        if (shouldSearchAll || filters.includes("seasons")) {
            response.seasons = { items: results[resultIndex], total: results[resultIndex + 1] };
            resultIndex += 2;
        }

        if (shouldSearchAll || filters.includes("episodes")) {
            response.episodes = { items: results[resultIndex], total: results[resultIndex + 1] };
            resultIndex += 2;
        }

        if (shouldSearchAll || filters.includes("users")) {
            response.users = { items: results[resultIndex], total: results[resultIndex + 1] };
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error searching:", error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}
