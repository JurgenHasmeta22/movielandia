import { prisma } from "../../../../prisma/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Serie } from "@prisma/client";

type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get("userId") ? Number(searchParams.get("userId")) : undefined;

        const filters: any = {};
        const orderByObject: any = {};

        const perPage = searchParams.get("perPage") ? Number(searchParams.get("perPage")) : 12;
        const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
        const skip = (page - 1) * perPage;
        const take = perPage;

        const title = searchParams.get("title") || undefined;
        if (title) filters.title = { contains: title };

        const filterValue = searchParams.get("filterValue") ? Number(searchParams.get("filterValue")) : undefined;
        const filterNameString = searchParams.get("filterNameString") || undefined;
        const filterOperatorString = (searchParams.get("filterOperatorString") as ">" | "<" | "=") || undefined;

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }

        const sortBy = searchParams.get("sortBy") || undefined;
        const ascOrDesc = (searchParams.get("ascOrDesc") as "asc" | "desc") || undefined;
        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const series = await prisma.serie.findMany({
            where: filters,
            orderBy: orderByObject,
            skip,
            take,
        });

        if (!series) {
            return NextResponse.json(null);
        }

        const serieIds = series.map((serie) => serie.id);

        const serieRatings = await prisma.serieReview.groupBy({
            by: ["serieId"],
            where: { serieId: { in: serieIds } },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const serieRatingsMap: RatingsMap = serieRatings.reduce((map, rating) => {
            map[rating.serieId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };

            return map;
        }, {} as RatingsMap);

        const seriesFinal = await Promise.all(
            series.map(async (serie) => {
                const { ...properties } = serie;

                let isBookmarked = false;

                if (userId) {
                    const existingFavorite = await prisma.userSerieFavorite.findFirst({
                        where: {
                            AND: [{ userId }, { serieId: serie.id }],
                        },
                    });

                    isBookmarked = !!existingFavorite;
                }

                const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

                return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
            }),
        );

        const count = await prisma.serie.count();

        if (seriesFinal) {
            return NextResponse.json({
                rows: seriesFinal,
                count,
            });
        }

        return NextResponse.json(null);
    } catch (error) {
        console.error("Error fetching series:", error);

        return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
    }
}
