"use server";

import { Actor, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { RatingsMap } from "./season.actions";

interface ActorModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    fullname?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

export async function getActors(
    {
        sortBy,
        ascOrDesc,
        perPage = 10,
        page = 1,
        fullname,
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

    if (fullname) filters.fullname = { contains: fullname };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

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

            const existingFavorite = await prisma.userActorFavorite.findFirst({
                where: {
                    AND: [{ userId }, { actorId: actor.id }],
                },
            });

            isBookmarked = !!existingFavorite;

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

export async function getActorsAll(): Promise<any | null> {
    const actorsAll = await prisma.actor.findMany();

    if (actorsAll) {
        return actorsAll;
    } else {
        return null;
    }
}

export async function getActorById(actorId: number, queryParams: any): Promise<Actor | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;

    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;
    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const actor = await prisma.actor.findFirst({
            where: {
                id: actorId,
            },
            include: {
                starredMovies: { include: { movie: true } },
                starredSeries: { include: { serie: true } },
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

                    // @ts-expect-error dunno
                    review.isUpvoted = !!existingUpvote;
                    // @ts-expect-error dunno
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

            return {
                ...actor,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Actor not found");
        }
    } catch (error) {
        throw new Error("Actor not found");
    }
}

export async function getActorByFullname(actorTitle: string, queryParams: any): Promise<Actor | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;

    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;

    const orderByObject: any = {};
    const fullnameFinal = actorTitle
        .split("")
        .map((char) => (char === "-" ? " " : char))
        .join("");

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const actor = await prisma.actor.findFirst({
            where: {
                fullname: fullnameFinal,
            },
            include: {
                starredMovies: { include: { movie: true } },
                starredSeries: { include: { serie: true } },
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

                    // @ts-expect-error dunno
                    review.isUpvoted = !!existingUpvote;
                    // @ts-expect-error dunno
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

            return {
                ...actor,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Actor not found");
        }
    } catch (error) {
        throw new Error("Actor not found");
    }
}

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

export async function addActor(actorParam: Actor): Promise<Actor | null> {
    const actorCreated = await prisma.actor.create({
        data: actorParam,
    });

    if (actorCreated) {
        return actorCreated;
    } else {
        return null;
    }
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

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const query = {
        where: {
            fullname: { contains: fullname },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 10 : 0,
        take: 10,
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

            const existingFavorite = await prisma.userActorFavorite.findFirst({
                where: {
                    AND: [{ userId }, { actorId: actor.id }],
                },
            });

            isBookmarked = !!existingFavorite;

            const ratingsInfo = actorRatingsMap[actor.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const count = await prisma.actor.count({
        where: {
            fullname: { contains: fullname },
        },
    });

    if (actors) {
        return { actors: actorsFinal, count };
    } else {
        return null;
    }
}
