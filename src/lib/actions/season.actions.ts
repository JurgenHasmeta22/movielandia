"use server";

import { Season, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";

interface SeasonModelParams {
    sortBy: string;
    ascOrDesc: "asc" | "desc";
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

export type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

export async function getSeasons({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    title,
    filterValue,
    filterNameString,
    filterOperatorString,
}: SeasonModelParams): Promise<Season[] | null> {
    const filters: any = {};
    const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
    const take = perPage || 20;

    if (title) filters.title = { contains: title };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const seasons = await prisma.season.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    if (seasons) {
        return seasons;
    } else {
        return null;
    }
}

export async function getSeasonById(seasonId: number): Promise<Season | null> {
    const result = await prisma.season.findFirst({
        where: { id: seasonId },
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function getSeasonByTitle(
    seasonTitle: string,
    serieId: number,
    queryParams: any,
): Promise<Season | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;

    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;

    const orderByObject: any = {};
    const titleFinal = seasonTitle
        .split("")
        .map((char) => (char === "-" ? " " : char))
        .join("");

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const season = await prisma.season.findFirst({
            where: {
                AND: [{ title: titleFinal }, { serieId }],
            },
            include: {
                episodes: true,
                reviews: {
                    include: {
                        user: true,
                        upvotes: {
                            take: upvotesPage ? upvotesPage * 5 : 5,
                            select: { user: true },
                        },
                        downvotes: {
                            take: downvotesPage ? downvotesPage * 5 : 5,
                            select: { user: true },
                        },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                    orderBy: orderByObject,
                    skip: skip,
                    take: take,
                },
            },
        });

        if (season) {
            const totalReviews = await prisma.seasonReview.count({
                where: { seasonId: season.id },
            });

            const ratings = await prisma.seasonReview.findMany({
                where: { seasonId: season.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of season.reviews) {
                    const existingUpvote = await prisma.upvoteSeasonReview.findFirst({
                        where: {
                            AND: [{ userId }, { seasonId: season.id }, { seasonReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteSeasonReview.findFirst({
                        where: {
                            AND: [{ userId }, { seasonId: season.id }, { seasonReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error dunno
                    review.isUpvoted = !!existingUpvote;
                    // @ts-expect-error dunno
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userSeasonFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { seasonId: season.id }],
                    },
                });
                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.seasonReview.findFirst({
                    where: {
                        AND: [{ userId }, { seasonId: season.id }],
                    },
                });
                isReviewed = !!existingReview;
            }

            return {
                ...season,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Season not found");
        }
    } catch (error) {
        throw new Error("Season not found");
    }
}

export async function getLatestSeasons(serieId: number): Promise<Season[] | null> {
    const seasonsWithEpisodes = await prisma.season.findMany({
        orderBy: {
            dateAired: "desc",
        },
        take: 10,
        include: { episodes: true },
        where: { serieId },
    });

    const seasonIds = seasonsWithEpisodes.map((season) => season.id);

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

    const seasons = seasonsWithEpisodes.map((season) => {
        const { episodes, ...properties } = season;
        const ratingsInfo = seasonRatingsMap[season.id] || { averageRating: 0, totalReviews: 0 };

        return { ...properties, ...ratingsInfo };
    });

    if (seasons) {
        return seasons;
    } else {
        return null;
    }
}

export async function getRelatedSeasons(title: string, serieId: number): Promise<Season[] | null> {
    const titleFinal = title
        .split("")
        .map((char) => (char === "-" ? " " : char))
        .join("");

    const season = await prisma.season.findFirst({
        where: {
            AND: [{ title: titleFinal }, { serieId }],
        },
    });

    const seasons = await prisma.season.findMany({
        where: { NOT: { id: season?.id }, AND: [{ serieId }] },
        include: { episodes: true },
    });

    if (!seasons.length) {
        return null;
    }

    const relatedSeasonIds = seasons.map((rm) => rm.id);

    if (!relatedSeasonIds.length) {
        return null;
    }

    const seasonRatings = await prisma.seasonReview.groupBy({
        by: ["seasonId"],
        where: { seasonId: { in: relatedSeasonIds } },
        _avg: { rating: true },
        _count: { rating: true },
    });

    const ratingsMap = seasonRatings.reduce(
        (acc, rating) => {
            acc[rating.seasonId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };

            return acc;
        },
        {} as { [key: number]: { averageRating: number; totalReviews: number } },
    );

    const seasonsFinal = seasons.map((relatedSeason) => {
        const { episodes, ...seasonDetails } = relatedSeason;
        const ratingsInfo = ratingsMap[relatedSeason.id] || { averageRating: 0, totalReviews: 0 };

        return { ...seasonDetails, episodes, ...ratingsInfo };
    });

    return seasonsFinal.length > 0 ? seasonsFinal : null;
}

export async function updateSeasonById(seasonParam: Prisma.SeasonUpdateInput, id: string): Promise<Season | null> {
    const season: Season | null = await prisma.season.findUnique({
        where: { id: Number(id) },
    });

    if (season) {
        const seasonUpdated = await prisma.season.update({
            where: { id: Number(id) },
            data: seasonParam,
        });

        if (seasonUpdated) {
            return seasonUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addSeason(seasonParam: Season): Promise<Season | null> {
    const seasonCreated = await prisma.season.create({
        data: seasonParam,
    });

    if (seasonCreated) {
        return seasonCreated;
    } else {
        return null;
    }
}

export async function deleteSeasonById(id: number): Promise<string | null> {
    const season: Season | null = await prisma.season.findUnique({
        where: { id },
    });

    if (season) {
        const result = await prisma.season.delete({
            where: { id },
        });

        if (result) {
            return "Season deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchSeasonsByTitle(title: string, page: number): Promise<Season[] | null> {
    const query = {
        where: {
            title: { contains: title },
        },
        skip: page ? (page - 1) * 20 : 0,
        take: 20,
    };

    const seasons = await prisma.season.findMany(query);

    if (seasons) {
        return seasons;
    } else {
        return null;
    }
}
