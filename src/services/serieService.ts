import { Prisma, Serie } from "@prisma/client";
import prisma from "@/lib/prisma";

interface SerieModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

const serieModel = {
    async getSeries({
        sortBy,
        ascOrDesc,
        perPage,
        page,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: SerieModelParams): Promise<any | null> {
        const filters: any = {};
        const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 10 : 0;
        const take = perPage || 10;

        if (title) filters.title = { contains: title };

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }

        const orderByObject: any = {};

        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const seriesWithGenres = await prisma.serie.findMany({
            where: filters,
            include: { genres: { select: { genre: true } } },
            orderBy: orderByObject,
            skip,
            take,
        });

        const serieIds = seriesWithGenres.map((serie) => serie.id);

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

        const series = seriesWithGenres.map((serie) => {
            const { genres, ...properties } = serie;
            const simplifiedGenres = genres.map((genre) => genre.genre);
            const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, genres: simplifiedGenres, ...ratingsInfo };
        });

        const count = await prisma.serie.count();

        if (series) {
            return { rows: series, count };
        } else {
            return null;
        }
    },
    async getSerieById(serieId: number): Promise<Serie | null> {
        const result = await prisma.serie.findFirst({
            where: { id: serieId },
            include: { genres: { select: { genre: true } } },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    },
    async getSerieByTitle(title: string, queryParams: any): Promise<Serie | any | null> {
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

        const serie = await prisma.serie.findFirst({
            where: { title: titleFinal },
            include: {
                genres: { select: { genre: true } },
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

        if (serie) {
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
                    const existingUpvote = await prisma.upvoteSerie.findFirst({
                        where: {
                            AND: [{ userId }, { serieId: serie.id }, { serieReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteSerie.findFirst({
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
        } else {
            return null;
        }
    },
    async getLatestSeries(): Promise<Serie[] | null> {
        const seriesWithGenres = await prisma.serie.findMany({
            orderBy: {
                releaseYear: "desc",
            },
            take: 10,
            include: { genres: { select: { genre: true } } },
        });

        const serieIds = seriesWithGenres.map((serie) => serie.id);

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

        const series = seriesWithGenres.map((serie) => {
            const { genres, ...properties } = serie;
            const simplifiedGenres = genres.map((genre) => genre.genre);
            const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, genres: simplifiedGenres, ...ratingsInfo };
        });

        if (series) {
            return series;
        } else {
            return null;
        }
    },
    async getRelatedSeries(title: string): Promise<Serie[] | null> {
        const serie = await prisma.serie.findFirst({
            where: { title },
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
            include: { genres: { select: { genre: true } } },
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
            const { genres, ...serieDetails } = relatedSerie;
            const simplifiedGenres = genres.map((genre) => genre.genre);
            const ratingsInfo = ratingsMap[relatedSerie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...serieDetails, genres: simplifiedGenres, ...ratingsInfo };
        });

        return series.length > 0 ? series : null;
    },
    async updateSerieById(serieParam: Prisma.SerieUpdateInput, id: string): Promise<Serie | null> {
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
    },
    async addSerie(serieParam: Prisma.SerieCreateInput): Promise<Serie | null> {
        const serieCreated = await prisma.serie.create({
            data: serieParam,
            include: { genres: { select: { genre: true } } },
        });

        if (serieCreated) {
            return serieCreated;
        } else {
            return null;
        }
    },
    async deleteSerieById(id: number): Promise<string | null> {
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
    },
    async searchSeriesByTitle(title: string, queryParams: any): Promise<any | null> {
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
    },
};

export default serieModel;
