"use server";

import { Actor, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { RatingsMap } from "./season.actions";
import { FilterOperator } from "@/types/filterOperators";
import { unstable_cacheLife as cacheLife } from "next/cache";

interface ActorModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    name?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

// #region "GET Methods"
export async function getActorsWithFilters(
    {
        sortBy,
        ascOrDesc,
        perPage = 12,
        page = 1,
        name,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: ActorModelParams,
    userId?: number,
): Promise<any | null> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (name) filters.name = { contains: name };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        if (filterOperatorString === "contains") {
            filters[filterNameString] = { contains: filterValue };
        } else {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }
    }

    orderByObject[sortBy || "fullname"] = ascOrDesc || "asc";

    const actors = await prisma.actor.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

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

    const actorsCount = await prisma.actor.count();

    if (actorsFinal) {
        return { actors: actorsFinal, count: actorsCount };
    } else {
        return null;
    }
}

export async function getActors(): Promise<any | null> {
    const actorsAll = await prisma.actor.findMany();

    if (actorsAll) {
        return actorsAll;
    } else {
        return null;
    }
}

export async function getActorsTotalCount(): Promise<number> {
    "use cache";

    cacheLife("days");

    try {
        const count = await prisma.actor.count();
        return count;
    } catch (error: unknown) {
        console.error("Error fetching actors total count:", error);
        throw new Error("Could not retrieve actors count");
    }
}

export async function getActorById(actorId: number, queryParams: any): Promise<Actor | any | null> {
    const {
        reviewsPage,
        reviewsAscOrDesc,
        reviewsSortBy,
        upvotesPage,
        downvotesPage,
        userId,
        starredMoviesPage,
        starredSeriesPage,
    } = queryParams;

    const skip = reviewsPage ? (reviewsPage - 1) * 5 : 0;
    const take = 5;
    const orderByObject: any = {};

    if (reviewsSortBy && reviewsAscOrDesc) {
        orderByObject[reviewsSortBy] = reviewsAscOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const actor = await prisma.actor.findFirst({
            where: {
                id: actorId,
            },
            include: {
                starredMovies: {
                    include: { movie: true },
                    skip: starredMoviesPage ? (starredMoviesPage - 1) * 6 : 0,
                    take: 6,
                },
                starredSeries: {
                    include: { serie: true },
                    skip: starredSeriesPage ? (starredSeriesPage - 1) * 6 : 0,
                    take: 6,
                },
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

        if (actor) {
            const totalReviews = await prisma.actorReview.count({
                where: { actorId: actor.id },
            });

            const ratings = await prisma.actorReview.findMany({
                where: { actorId: actor.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of actor.reviews) {
                    const existingUpvote = await prisma.upvoteActorReview.findFirst({
                        where: {
                            AND: [{ userId }, { actorId: actor.id }, { actorReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteActorReview.findFirst({
                        where: {
                            AND: [{ userId }, { actorId: actor.id }, { actorReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error type
                    review.isUpvoted = !!existingUpvote;

                    // @ts-expect-error type
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userActorFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { actorId: actor.id }],
                    },
                });
                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.actorReview.findFirst({
                    where: {
                        AND: [{ userId }, { actorId: actor.id }],
                    },
                });
                isReviewed = !!existingReview;
            }

            const [totalMovies, totalSeries] = await Promise.all([
                prisma.castMovie.count({ where: { actorId: actor.id } }),
                prisma.castSerie.count({ where: { actorId: actor.id } }),
            ]);

            return {
                ...actor,
                averageRating,
                totalReviews,
                totalMovies,
                totalSeries,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            return "Actor not found";
        }
    } catch (error) {
        throw new Error("Actor not found");
    }
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updateActorById(actorParam: Prisma.ActorUpdateInput, id: string): Promise<Actor | null> {
    const actor: Actor | null = await prisma.actor.findUnique({
        where: { id: Number(id) },
    });

    if (actor) {
        const actorUpdated = await prisma.actor.update({
            where: { id: Number(id) },
            data: actorParam,
        });

        if (actorUpdated) {
            return actorUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addActor(actorParam: Prisma.ActorCreateInput): Promise<Actor | null> {
    try {
        const actorCreated = await prisma.actor.create({
            data: actorParam,
        });

        if (actorCreated) {
            return actorCreated;
        }
    } catch (error) {
        console.error("Error creating actor:", error);
        return null;
    }

    return null;
}

export async function deleteActorById(id: number): Promise<string | null> {
    const actor: Actor | null = await prisma.actor.findUnique({
        where: { id },
    });

    if (actor) {
        const result = await prisma.actor.delete({
            where: { id },
        });

        if (result) {
            return "Actor deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchActorsByTitle(fullname: string, queryParams: any, userId?: number): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    orderByObject[sortBy || "fullname"] = ascOrDesc || "asc";

    const actors = await prisma.actor.findMany({
        where: {
            fullname: { contains: fullname, mode: "insensitive" },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
    });

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
            fullname: { contains: fullname, mode: "insensitive" },
        },
    });

    if (actors) {
        return { actors: actorsFinal, count };
    } else {
        return null;
    }
}
// #endregion
