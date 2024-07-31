"use server";

import { Actor, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { RatingsMap } from "./season.actions";

interface ActorModelParams {
    sortBy: string;
    ascOrDesc: "asc" | "desc";
    perPage: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

export async function getActors({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    title,
    filterValue,
    filterNameString,
    filterOperatorString,
}: ActorModelParams): Promise<Actor[] | null> {
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

    const actors = await prisma.actor.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    if (actors) {
        return actors;
    } else {
        return null;
    }
}

export async function getActorById(actorId: number): Promise<Actor | null> {
    const result = await prisma.actor.findFirst({
        where: { id: actorId },
    });

    if (result) {
        return result;
    } else {
        return null;
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

export async function searchActorsByTitle(fullname: string, page: number): Promise<Actor[] | null> {
    const query = {
        where: {
            fullname: { contains: fullname },
        },
        skip: page ? (page - 1) * 20 : 0,
        take: 20,
    };

    const actors = await prisma.actor.findMany(query);

    if (actors) {
        return actors;
    } else {
        return null;
    }
}
