import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";
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
        const title = searchParams.get("title") || "";
        const page = Number(searchParams.get("page")) || 1;
        const sortBy = searchParams.get("sortBy") || undefined;
        const ascOrDesc = searchParams.get("ascOrDesc") as "asc" | "desc" | undefined;
        const userId = searchParams.get("userId") ? Number(searchParams.get("userId")) : undefined;

        const orderByObject: any = {};
        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const query = {
            where: {
                title: { contains: title },
            },
            orderBy: orderByObject,
            skip: (page - 1) * 12,
            take: 12,
        };

        const series = await prisma.serie.findMany(query);
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

        const count = await prisma.serie.count({
            where: {
                title: { contains: title },
            },
        });

        return NextResponse.json({ rows: seriesFinal, count });
    } catch (error) {
        console.error("Error searching series:", error);
        return NextResponse.json({ error: "Failed to search series" }, { status: 500 });
    }
}
