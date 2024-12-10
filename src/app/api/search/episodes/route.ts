import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";
import { Episode } from "@prisma/client";

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

        const episodes = await prisma.episode.findMany(query);
        const episodeIds = episodes.map((episode: Episode) => episode.id);

        const episodeRatings = await prisma.episodeReview.groupBy({
            by: ["episodeId"],
            where: { episodeId: { in: episodeIds } },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const episodeRatingsMap: RatingsMap = episodeRatings.reduce((map, rating) => {
            map[rating.episodeId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return map;
        }, {} as RatingsMap);

        const episodesFinal = await Promise.all(
            episodes.map(async (episode) => {
                const { ...properties } = episode;
                let isBookmarked = false;

                if (userId) {
                    const existingFavorite = await prisma.userEpisodeFavorite.findFirst({
                        where: {
                            AND: [{ userId }, { episodeId: episode.id }],
                        },
                    });
                    isBookmarked = !!existingFavorite;
                }

                const ratingsInfo = episodeRatingsMap[episode.id] || { averageRating: 0, totalReviews: 0 };
                return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
            }),
        );

        const count = await prisma.episode.count({
            where: {
                title: { contains: title },
            },
        });

        return NextResponse.json({ episodes: episodesFinal, count });
    } catch (error) {
        console.error("Error searching episodes:", error);
        return NextResponse.json({ error: "Failed to search episodes" }, { status: 500 });
    }
} 