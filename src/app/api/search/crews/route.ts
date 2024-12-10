import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";
import { Crew } from "@prisma/client";

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

        const crews = await prisma.crew.findMany(query);
        const crewIds = crews.map((crew: Crew) => crew.id);

        const crewRatings = await prisma.crewReview.groupBy({
            by: ["crewId"],
            where: { crewId: { in: crewIds } },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const crewRatingsMap: RatingsMap = crewRatings.reduce((map, rating) => {
            map[rating.crewId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return map;
        }, {} as RatingsMap);

        const crewsFinal = await Promise.all(
            crews.map(async (crew) => {
                const { ...properties } = crew;
                let isBookmarked = false;

                if (userId) {
                    const existingFavorite = await prisma.userCrewFavorite.findFirst({
                        where: {
                            AND: [{ userId }, { crewId: crew.id }],
                        },
                    });
                    isBookmarked = !!existingFavorite;
                }

                const ratingsInfo = crewRatingsMap[crew.id] || { averageRating: 0, totalReviews: 0 };
                return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
            }),
        );

        const count = await prisma.crew.count({
            where: {
                fullname: { contains: fullname },
            },
        });

        return NextResponse.json({ crews: crewsFinal, count });
    } catch (error) {
        console.error("Error searching crews:", error);
        return NextResponse.json({ error: "Failed to search crews" }, { status: 500 });
    }
}
