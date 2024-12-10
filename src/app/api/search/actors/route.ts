import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";
import { Actor } from "@prisma/client";

type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const fullname = searchParams.get("fullname") || "";
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
                fullname: { contains: fullname },
            },
            orderBy: orderByObject,
            skip: (page - 1) * 12,
            take: 12,
        };

        const actors = await prisma.actor.findMany(query);
        const actorIds = actors.map((actor: Actor) => actor.id);

        const actorRatings = await prisma.actorReview.groupBy({
            by: ["actorId"],
            where: { actorId: { in: actorIds } },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const actorRatingsMap: RatingsMap = actorRatings.reduce((map, rating) => {
            map[rating.actorId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return map;
        }, {} as RatingsMap);

        const actorsFinal = await Promise.all(
            actors.map(async (actor) => {
                const { ...properties } = actor;
                let isBookmarked = false;

                if (userId) {
                    const existingFavorite = await prisma.userActorFavorite.findFirst({
                        where: {
                            AND: [{ userId }, { actorId: actor.id }],
                        },
                    });
                    isBookmarked = !!existingFavorite;
                }

                const ratingsInfo = actorRatingsMap[actor.id] || { averageRating: 0, totalReviews: 0 };
                return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
            }),
        );

        const count = await prisma.actor.count({
            where: {
                fullname: { contains: fullname },
            },
        });

        return NextResponse.json({ actors: actorsFinal, count });
    } catch (error) {
        console.error("Error searching actors:", error);
        return NextResponse.json({ error: "Failed to search actors" }, { status: 500 });
    }
}
