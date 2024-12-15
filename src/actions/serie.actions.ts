"use server";

import { Prisma, Serie } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { FilterOperator } from "@/types/filterOperators";

interface SerieModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

// #region "GET Methods"
export async function getSeriesWithFilters(
    {
        sortBy,
        ascOrDesc,
        perPage = 12,
        page = 1,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: SerieModelParams,
    userId?: number,
): Promise<any | null> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (title) filters.title = { contains: title };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        if (filterOperatorString === "contains") {
            filters[filterNameString] = { contains: filterValue };
        } else {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }
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

    const seriesFinal = await Promise.all(
        series.map(async (serie) => {
            const { ...properties } = serie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userSerieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const count = await prisma.serie.count();

    if (seriesFinal) {
        return { rows: seriesFinal, count };
    } else {
        return null;
    }
}

export async function getSeries(): Promise<any | null> {
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
                cast: {
                    include: { actor: true },
                    skip: queryParams.castPage ? (queryParams.castPage - 1) * 5 : 0,
                    take: 6,
                },
                crew: {
                    include: { crew: true },
                    skip: queryParams.crewPage ? (queryParams.crewPage - 1) * 5 : 0,
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
                seasons: {
                    skip: queryParams.seasonsPage ? (queryParams.seasonsPage - 1) * 5 : 0,
                    take: 6,
                },
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

                // @ts-expect-error type
                review.isUpvoted = !!existingUpvote;

                // @ts-expect-error type
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

        const [totalCast, totalCrew, totalSeasons] = await Promise.all([
            prisma.castSerie.count({ where: { serieId: serie.id } }),
            prisma.crewSerie.count({ where: { serieId: serie.id } }),
            prisma.season.count({ where: { serieId: serie.id } }),
        ]);

        return {
            ...serie,
            averageRating,
            totalReviews,
            totalCast,
            totalCrew,
            totalSeasons,
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

                // @ts-expect-error type
                review.isUpvoted = !!existingUpvote;

                // @ts-expect-error type
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

export async function getLatestSeries(userId?: number): Promise<Serie[] | null> {
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

    const seriesFinal = await Promise.all(
        series.map(async (serie) => {
            const { ...properties } = serie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userSerieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    if (seriesFinal) {
        return seriesFinal;
    } else {
        return null;
    }
}

export async function getRelatedSeries(id: number, userId?: number): Promise<Serie[] | null> {
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

    const series = await Promise.all(
        relatedSeries.map(async (serie) => {
            const { ...properties } = serie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userSerieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = ratingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    return series.length > 0 ? series : null;
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
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

export async function searchSeriesByTitle(title: string, queryParams: any, userId?: number): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const query = {
        where: {
            title: { contains: title },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
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

    const serieRatingsMap: RatingsMap = serieRatings.reduce((map, rating) => {
        map[rating.serieId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const seriesFinal = await Promise.all(
        series.map(async (serie) => {
            const { ...properties } = serie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userSerieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { serieId: serie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

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
// #endregion
