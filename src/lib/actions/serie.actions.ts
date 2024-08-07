"use server";

import { Prisma, Serie } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";

interface SerieModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

export async function getSeries({
    sortBy,
    ascOrDesc,
    perPage = 12,
    page = 1,
    title,
    filterValue,
    filterNameString,
    filterOperatorString,
}: SerieModelParams): Promise<any | null> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (title) filters.title = { contains: title };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const series = await prisma.serie.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

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

    const seriesFinal = series.map((serie) => {
        const { ...properties } = serie;
        const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

        return { ...properties, ...ratingsInfo };
    });

    const count = await prisma.serie.count();

    if (seriesFinal) {
        return { rows: seriesFinal, count };
    } else {
        return null;
    }
}

export async function getSeriesAll(): Promise<any | null> {
    const seriesAll = await prisma.serie.findMany();

    if (seriesAll) {
        return seriesAll;
    } else {
        return null;
    }
}

export async function getSerieById(id: number, queryParams: any): Promise<Serie | any | null> {
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
        const serie = await prisma.serie.findFirst({
            where: { id },
            include: {
                genres: { select: { genre: true } },
                cast: { include: { actor: true } },
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
                seasons: true,
            },
        });

        if (!serie) {
            throw new Error("Serie not found");
        }

        const totalReviews = await prisma.serieReview.count({
            where: { serieId: serie.id },
        });

        const ratings = await prisma.serieReview.findMany({
            where: { serieId: serie.id },
            select: { rating: true },
        });

        const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        let isBookmarked = false;
        let isReviewed = false;

        if (userId) {
            for (const review of serie.reviews) {
                const existingUpvote = await prisma.upvoteSerieReview.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }, { serieReviewId: review.id }],
                    },
                });

                const existingDownvote = await prisma.downvoteSerieReview.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }, { serieReviewId: review.id }],
                    },
                });

                // @ts-expect-error dunno
                review.isUpvoted = !!existingUpvote;
                // @ts-expect-error dunno
                review.isDownvoted = !!existingDownvote;
            }

            const existingFavorite = await prisma.userSerieFavorite.findFirst({
                where: {
                    AND: [{ userId }, { serieId: serie.id }],
                },
            });
            isBookmarked = !!existingFavorite;

            const existingReview = await prisma.serieReview.findFirst({
                where: {
                    AND: [{ userId }, { serieId: serie.id }],
                },
            });
            isReviewed = !!existingReview;
        }

        return {
            ...serie,
            averageRating,
            totalReviews,
            ...(userId && { isBookmarked, isReviewed }),
        };
    } catch (error) {
        throw new Error("Serie not found");
    }
}

export async function getSerieByTitle(title: string, queryParams: any): Promise<Serie | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;
    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;
    const orderByObject: any = {};
    const titleFinal = title
        .split("")
        .map((char) => (char === "-" ? " " : char))
        .join("");

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const serie = await prisma.serie.findFirst({
            where: { title: titleFinal },
            include: {
                genres: { select: { genre: true } },
                cast: { include: { actor: true } },
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
                seasons: true,
            },
        });

        if (!serie) {
            throw new Error("Serie not found");
        }

        const totalReviews = await prisma.serieReview.count({
            where: { serieId: serie.id },
        });

        const ratings = await prisma.serieReview.findMany({
            where: { serieId: serie.id },
            select: { rating: true },
        });

        const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        let isBookmarked = false;
        let isReviewed = false;

        if (userId) {
            for (const review of serie.reviews) {
                const existingUpvote = await prisma.upvoteSerieReview.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }, { serieReviewId: review.id }],
                    },
                });

                const existingDownvote = await prisma.downvoteSerieReview.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }, { serieReviewId: review.id }],
                    },
                });

                // @ts-expect-error dunno
                review.isUpvoted = !!existingUpvote;
                // @ts-expect-error dunno
                review.isDownvoted = !!existingDownvote;
            }

            const existingFavorite = await prisma.userSerieFavorite.findFirst({
                where: {
                    AND: [{ userId }, { serieId: serie.id }],
                },
            });
            isBookmarked = !!existingFavorite;

            const existingReview = await prisma.serieReview.findFirst({
                where: {
                    AND: [{ userId }, { serieId: serie.id }],
                },
            });
            isReviewed = !!existingReview;
        }

        return {
            ...serie,
            averageRating,
            totalReviews,
            ...(userId && { isBookmarked, isReviewed }),
        };
    } catch (error) {
        throw new Error("Serie not found");
    }
}

export async function getLatestSeries(): Promise<Serie[] | null> {
    const series = await prisma.serie.findMany({
        orderBy: {
            dateAired: "desc",
        },
        take: 6,
    });

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

    const seriesFinal = series.map((serie) => {
        const { ...properties } = serie;
        const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

        return { ...properties, ...ratingsInfo };
    });

    if (seriesFinal) {
        return seriesFinal;
    } else {
        return null;
    }
}

export async function getRelatedSeries(id: number): Promise<Serie[] | null> {
    const serie = await prisma.serie.findFirst({
        where: { id },
    });

    const seriesGenres = await prisma.serieGenre.findMany({
        where: { serieId: serie?.id },
        select: { genreId: true },
    });

    if (!seriesGenres.length) {
        return null;
    }

    const genreIds = seriesGenres.map((sg) => sg.genreId);
    const relatedSerieIdsByGenre = await prisma.serieGenre.findMany({
        where: {
            genreId: { in: genreIds },
            serieId: { not: serie?.id },
        },
        distinct: ["serieId"],
        select: { serieId: true },
    });

    const relatedSerieIds = relatedSerieIdsByGenre.map((rs) => rs.serieId);

    if (!relatedSerieIds.length) {
        return null;
    }

    const relatedSeries = await prisma.serie.findMany({
        where: { id: { in: relatedSerieIds } },
    });

    const serieRatings = await prisma.serieReview.groupBy({
        by: ["serieId"],
        where: { serieId: { in: relatedSerieIds } },
        _avg: { rating: true },
        _count: { rating: true },
    });

    const ratingsMap = serieRatings.reduce(
        (acc, rating) => {
            acc[rating.serieId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };

            return acc;
        },
        {} as { [key: number]: { averageRating: number; totalReviews: number } },
    );

    const series = relatedSeries.map((relatedSerie) => {
        const { ...serieDetails } = relatedSerie;
        const ratingsInfo = ratingsMap[relatedSerie.id] || { averageRating: 0, totalReviews: 0 };

        return { ...serieDetails, ...ratingsInfo };
    });

    return series.length > 0 ? series : null;
}

export async function updateSerieById(serieParam: Prisma.SerieUpdateInput, id: string): Promise<Serie | null> {
    const serie: Serie | null = await prisma.serie.findUnique({
        where: { id: Number(id) },
    });

    if (serie) {
        const serieUpdated = await prisma.serie.update({
            where: { id: Number(id) },
            data: serieParam,
            include: { genres: { select: { genre: true } } },
        });

        if (serieUpdated) {
            return serieUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addSerie(serieParam: Prisma.SerieCreateInput): Promise<Serie | null> {
    const serieCreated = await prisma.serie.create({
        data: serieParam,
        include: { genres: { select: { genre: true } } },
    });

    if (serieCreated) {
        return serieCreated;
    } else {
        return null;
    }
}

export async function deleteSerieById(id: number): Promise<string | null> {
    const serie: Serie | null = await prisma.serie.findUnique({
        where: { id },
    });

    if (serie) {
        const result = await prisma.serie.delete({
            where: { id },
        });

        if (result) {
            return "Serie deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchSeriesByTitle(title: string, queryParams: any): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const query = {
        where: {
            title: { contains: title },
        },
        include: { genres: { select: { genre: true } } },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 10 : 0,
        take: 10,
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

    type RatingsMap = {
        [key: number]: {
            averageRating: number;
            totalReviews: number;
        };
    };

    const serieRatingsMap: RatingsMap = serieRatings.reduce((map, rating) => {
        map[rating.serieId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const seriesFinal = series.map((serie) => {
        const { genres, ...properties } = serie;
        const simplifiedGenres = genres.map((genre) => genre.genre);
        const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

        return { ...properties, genres: simplifiedGenres, ...ratingsInfo };
    });

    const count = await prisma.serie.count({
        where: {
            title: { contains: title },
        },
    });

    if (series) {
        return { rows: seriesFinal, count };
    } else {
        return null;
    }
}
