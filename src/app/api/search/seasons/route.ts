import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";
import { Season } from "@prisma/client";

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

        const seasons = await prisma.season.findMany(query);
        const seasonIds = seasons.map((season: Season) => season.id);

        const seasonRatings = await prisma.seasonReview.groupBy({
            by: ["seasonId"],
            where: { seasonId: { in: seasonIds } },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const seasonRatingsMap: RatingsMap = seasonRatings.reduce((map, rating) => {
            map[rating.seasonId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return map;
        }, {} as RatingsMap);

        const seasonsFinal = await Promise.all(
            seasons.map(async (season) => {
                const { ...properties } = season;
                let isBookmarked = false;

                if (userId) {
                    const existingFavorite = await prisma.userSeasonFavorite.findFirst({
                        where: {
                            AND: [{ userId }, { seasonId: season.id }],
                        },
                    });
                    isBookmarked = !!existingFavorite;
                }

                const ratingsInfo = seasonRatingsMap[season.id] || { averageRating: 0, totalReviews: 0 };
                return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
            }),
        );

        const count = await prisma.season.count({
            where: {
                title: { contains: title },
            },
        });

        return NextResponse.json({ seasons: seasonsFinal, count });
    } catch (error) {
        console.error("Error searching seasons:", error);
        return NextResponse.json({ error: "Failed to search seasons" }, { status: 500 });
    }
}
