"use server";

import { Episode, Prisma } from "@prisma/client";
import { RatingsMap } from "./season.actions";
import { prisma } from "../../prisma/config/prisma";
import { FilterOperator } from "@/types/filterOperators";

interface EpisodeModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

// #region "GET Methods"
export async function getEpisodesWithFilters({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    title,
    filterValue,
    filterNameString,
    filterOperatorString,
}: EpisodeModelParams): Promise<any | null> {
    const filters: any = {};
    const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
    const take = perPage || 20;

    if (title) filters.title = { contains: title };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        if (filterOperatorString === "contains") {
            filters[filterNameString] = { contains: filterValue };
        } else {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const episodes = await prisma.episode.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    if (episodes) {
        const epispodesCount = await prisma.episode.count();
        return { episodes, count: epispodesCount };
    } else {
        return null;
    }
}

export async function getEpisodes(): Promise<any | null> {
    const episodesAll = await prisma.episode.findMany();

    if (episodesAll) {
        return episodesAll;
    } else {
        return null;
    }
}

export async function getEpisodeById(episodeId: number, queryParams: any): Promise<Episode | any | null> {
    const { reviewsPage, reviewsAscOrDesc, reviewsSortBy, upvotesPage, downvotesPage, userId } = queryParams;
    const skip = reviewsPage ? (reviewsPage - 1) * 5 : 0;
    const take = 5;
    const orderByObject: any = {};

    if (reviewsSortBy && reviewsAscOrDesc) {
        orderByObject[reviewsSortBy] = reviewsAscOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const episode = await prisma.episode.findFirst({
            where: { id: episodeId },
            include: {
                season: true,
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

        if (!episode) {
            throw new Error("Episode not found");
        }

        const totalReviews = await prisma.episodeReview.count({
            where: { episodeId: episode.id },
        });

        const ratings = await prisma.episodeReview.findMany({
            where: { episodeId: episode.id },
            select: { rating: true },
        });

        const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        let isBookmarked = false;
        let isReviewed = false;

        if (userId) {
            for (const review of episode.reviews) {
                const existingUpvote = await prisma.upvoteEpisodeReview.findFirst({
                    where: {
                        AND: [{ userId }, { episodeId: episode.id }, { episodeReviewId: review.id }],
                    },
                });

                const existingDownvote = await prisma.downvoteEpisodeReview.findFirst({
                    where: {
                        AND: [{ userId }, { episodeId: episode.id }, { episodeReviewId: review.id }],
                    },
                });

                // @ts-expect-error type
                review.isUpvoted = !!existingUpvote;

                // @ts-expect-error type
                review.isDownvoted = !!existingDownvote;
            }

            const existingFavorite = await prisma.userEpisodeFavorite.findFirst({
                where: {
                    AND: [{ userId }, { episodeId: episode.id }],
                },
            });

            isBookmarked = !!existingFavorite;

            const existingReview = await prisma.episodeReview.findFirst({
                where: {
                    AND: [{ userId }, { episodeId: episode.id }],
                },
            });

            isReviewed = !!existingReview;
        }

        return {
            ...episode,
            averageRating,
            totalReviews,
            ...(userId && { isBookmarked, isReviewed }),
        };
    } catch (error) {
        throw new Error("Episode not found");
    }
}

export async function getEpisodeByTitle(
    episodeTitle: string,
    seasonId: number,
    queryParams: any,
): Promise<Episode | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;

    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;

    const orderByObject: any = {};
    const titleFinal = episodeTitle
        .split("")
        .map((char) => (char === "-" ? " " : char))
        .join("");

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const episode = await prisma.episode.findFirst({
            where: {
                AND: [{ title: titleFinal }, { seasonId }],
            },
            include: {
                season: true,
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

        if (episode) {
            const totalReviews = await prisma.episodeReview.count({
                where: { episodeId: episode.id },
            });

            const ratings = await prisma.episodeReview.findMany({
                where: { episodeId: episode.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of episode.reviews) {
                    const existingUpvote = await prisma.upvoteEpisodeReview.findFirst({
                        where: {
                            AND: [{ userId }, { episodeId: episode.id }, { episodeReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteEpisodeReview.findFirst({
                        where: {
                            AND: [{ userId }, { episodeId: episode.id }, { episodeReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error type
                    review.isUpvoted = !!existingUpvote;

                    // @ts-expect-error type
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userEpisodeFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { episodeId: episode.id }],
                    },
                });
                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.episodeReview.findFirst({
                    where: {
                        AND: [{ userId }, { episodeId: episode.id }],
                    },
                });
                isReviewed = !!existingReview;
            }

            return {
                ...episode,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Episode not found");
        }
    } catch (error) {
        throw new Error("Episode not found");
    }
}

export async function getLatestEpisodes(seasonId: number): Promise<Episode[] | null> {
    const episodesWithEpisodes = await prisma.episode.findMany({
        orderBy: {
            dateAired: "desc",
        },
        take: 10,
        include: { season: true },
        where: { seasonId },
    });

    const episodeIds = episodesWithEpisodes.map((episode) => episode.id);

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

    const episodes = episodesWithEpisodes.map((episode) => {
        const { season, ...properties } = episode;
        const ratingsInfo = episodeRatingsMap[episode.id] || { averageRating: 0, totalReviews: 0 };

        return { ...properties, ...ratingsInfo };
    });

    if (episodes) {
        return episodes;
    } else {
        return null;
    }
}

export async function getRelatedEpisodes(
    id: number,
    seasonId: number,
    page: number = 1,
    perPage: number = 6,
): Promise<{ episodes: Episode[] | null; count: number }> {
    const skip = (page - 1) * perPage;

    const episode = await prisma.episode.findFirst({
        where: {
            AND: [{ id }, { seasonId }],
        },
    });

    const episodes = await prisma.episode.findMany({
        where: { NOT: { id: episode?.id }, AND: [{ seasonId }] },
        include: { season: true },
        skip,
        take: perPage,
    });

    const totalCount = await prisma.episode.count({
        where: { NOT: { id: episode?.id }, AND: [{ seasonId }] },
    });

    if (!episodes.length) {
        return { episodes: null, count: 0 };
    }

    const relatedEpisodeIds = episodes.map((rm) => rm.id);

    if (!relatedEpisodeIds.length) {
        return { episodes: null, count: 0 };
    }

    const episodeRatings = await prisma.episodeReview.groupBy({
        by: ["episodeId"],
        where: { episodeId: { in: relatedEpisodeIds } },
        _avg: { rating: true },
        _count: { rating: true },
    });

    const ratingsMap = episodeRatings.reduce(
        (acc, rating) => {
            acc[rating.episodeId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };

            return acc;
        },
        {} as { [key: number]: { averageRating: number; totalReviews: number } },
    );

    const episodesFinal = episodes.map((relatedEpisode) => {
        const { season, ...episodeDetails } = relatedEpisode;
        const ratingsInfo = ratingsMap[relatedEpisode.id] || { averageRating: 0, totalReviews: 0 };

        return { ...episodeDetails, season, ...ratingsInfo };
    });

    return {
        episodes: episodesFinal.length > 0 ? episodesFinal : null,
        count: totalCount,
    };
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updateEpisodeById(episodeParam: Prisma.EpisodeUpdateInput, id: string): Promise<Episode | null> {
    const episode: Episode | null = await prisma.episode.findUnique({
        where: { id: Number(id) },
    });

    if (episode) {
        const episodeUpdated = await prisma.episode.update({
            where: { id: Number(id) },
            data: episodeParam,
        });

        if (episodeUpdated) {
            return episodeUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addEpisode(episodeParam: Prisma.EpisodeUncheckedCreateInput): Promise<Episode | null> {
    const episodeCreated = await prisma.episode.create({
        data: episodeParam,
    });

    if (episodeCreated) {
        return episodeCreated;
    } else {
        return null;
    }
}

export async function deleteEpisodeById(id: number): Promise<string | null> {
    const episode: Episode | null = await prisma.episode.findUnique({
        where: { id },
    });

    if (episode) {
        const result = await prisma.episode.delete({
            where: { id },
        });

        if (result) {
            return "Episode deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchEpisodesByTitle(title: string, queryParams: any, userId?: number): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    orderByObject[sortBy || "title"] = ascOrDesc || "asc";

    const episodes = await prisma.episode.findMany({
        where: {
            title: { contains: title, mode: "insensitive" },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
    });

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

    if (episodes) {
        return { episodes: episodesFinal, count };
    } else {
        return null;
    }
}
// #endregion
