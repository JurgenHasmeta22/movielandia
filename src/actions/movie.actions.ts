"use server";

import { Movie, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { FilterOperator } from "@/types/filterOperators";

interface MovieModelParams {
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
export async function getMoviesWithFilters(
    {
        sortBy,
        ascOrDesc,
        perPage = 12,
        page = 1,
        title,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: MovieModelParams,
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

    const movies = await prisma.movie.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    const movieIds = movies.map((movie: Movie) => movie.id);

    const movieRatings = await prisma.movieReview.groupBy({
        by: ["movieId"],
        where: { movieId: { in: movieIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const movieRatingsMap: RatingsMap = movieRatings.reduce((map, rating) => {
        map[rating.movieId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const moviesFinal = await Promise.all(
        movies.map(async (movie) => {
            const { ...properties } = movie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userMovieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = movieRatingsMap[movie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const moviesCount = await prisma.movie.count();

    return { movies: moviesFinal, count: moviesCount };
}

export async function getMovies(): Promise<any | null> {
    const moviesAll = await prisma.movie.findMany();

    if (moviesAll) {
        return moviesAll;
    } else {
        return null;
    }
}

export async function getMovieById(movieId: number, queryParams: any): Promise<Movie | any | null> {
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
        const movie = await prisma.movie.findFirst({
            where: { id: movieId },
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
            },
        });

        if (!movie) {
            throw new Error("Movie not found");
        }

        const totalReviews = await prisma.movieReview.count({
            where: { movieId: movie.id },
        });

        const ratings = await prisma.movieReview.findMany({
            where: { movieId: movie.id },
            select: { rating: true },
        });

        const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        let isBookmarked = false;
        let isReviewed = false;

        if (userId) {
            for (const review of movie.reviews) {
                const existingUpvote = await prisma.upvoteMovieReview.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }, { movieReviewId: review.id }],
                    },
                });

                const existingDownvote = await prisma.downvoteMovieReview.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }, { movieReviewId: review.id }],
                    },
                });

                // @ts-expect-error type
                review.isUpvoted = !!existingUpvote;

                // @ts-expect-error type
                review.isDownvoted = !!existingDownvote;
            }

            const existingFavorite = await prisma.userMovieFavorite.findFirst({
                where: {
                    AND: [{ userId }, { movieId: movie.id }],
                },
            });

            isBookmarked = !!existingFavorite;

            const existingReview = await prisma.movieReview.findFirst({
                where: {
                    AND: [{ userId }, { movieId: movie.id }],
                },
            });
            
            isReviewed = !!existingReview;
        }

        const [totalCast, totalCrew] = await Promise.all([
            prisma.castMovie.count({ where: { movieId: movie.id } }),
            prisma.crewMovie.count({ where: { movieId: movie.id } }),
        ]);

        return {
            ...movie,
            averageRating,
            totalReviews,
            totalCast,
            totalCrew,
            ...(userId && { isBookmarked, isReviewed }),
        };
    } catch (error) {
        throw new Error("Movie not found");
    }
}

export async function getMovieByTitle(title: string, queryParams: any): Promise<Movie | any | null> {
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
        const movie = await prisma.movie.findFirst({
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
            },
        });

        if (movie) {
            const totalReviews = await prisma.movieReview.count({
                where: { movieId: movie.id },
            });

            const ratings = await prisma.movieReview.findMany({
                where: { movieId: movie.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of movie.reviews) {
                    const existingUpvote = await prisma.upvoteMovieReview.findFirst({
                        where: {
                            AND: [{ userId }, { movieId: movie.id }, { movieReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteMovieReview.findFirst({
                        where: {
                            AND: [{ userId }, { movieId: movie.id }, { movieReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error type
                    review.isUpvoted = !!existingUpvote;

                    // @ts-expect-error type
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userMovieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.movieReview.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }],
                    },
                });

                isReviewed = !!existingReview;
            }

            return {
                ...movie,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Movie not found");
        }
    } catch (error) {
        throw new Error("Movie not found");
    }
}

export async function getLatestMovies(userId?: number): Promise<Movie[] | null> {
    const movies = await prisma.movie.findMany({
        orderBy: {
            dateAired: "desc",
        },
        take: 6,
    });

    const movieIds = movies.map((movie) => movie.id);

    const movieRatings = await prisma.movieReview.groupBy({
        by: ["movieId"],
        where: { movieId: { in: movieIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const movieRatingsMap: RatingsMap = movieRatings.reduce((map, rating) => {
        map[rating.movieId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const moviesFinal = await Promise.all(
        movies.map(async (movie) => {
            const { ...properties } = movie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userMovieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = movieRatingsMap[movie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    if (moviesFinal) {
        return moviesFinal;
    } else {
        return null;
    }
}

export async function getRelatedMovies(id: number, userId?: number): Promise<Movie[] | null> {
    const movie = await prisma.movie.findFirst({
        where: { id },
    });

    const movieGenres = await prisma.movieGenre.findMany({
        where: { movieId: movie?.id },
        select: { genreId: true },
    });

    if (!movieGenres.length) {
        return null;
    }

    const genreIds = movieGenres.map((mg) => mg.genreId);
    const relatedMovieIdsByGenre = await prisma.movieGenre.findMany({
        where: {
            genreId: { in: genreIds },
            movieId: { not: movie?.id },
        },
        distinct: ["movieId"],
        select: { movieId: true },
    });

    const relatedMovieIds = relatedMovieIdsByGenre.map((rm) => rm.movieId);

    if (!relatedMovieIds.length) {
        return null;
    }

    const relatedMovies = await prisma.movie.findMany({
        where: { id: { in: relatedMovieIds } },
    });

    const movieRatings = await prisma.movieReview.groupBy({
        by: ["movieId"],
        where: { movieId: { in: relatedMovieIds } },
        _avg: { rating: true },
        _count: { rating: true },
    });

    const ratingsMap = movieRatings.reduce(
        (acc, rating) => {
            acc[rating.movieId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };

            return acc;
        },
        {} as { [key: number]: { averageRating: number; totalReviews: number } },
    );

    const movies = await Promise.all(
        relatedMovies.map(async (movie) => {
            const { ...properties } = movie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userMovieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = ratingsMap[movie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    return movies.length > 0 ? movies : null;
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updateMovieById(movieParam: Prisma.MovieUpdateInput, id: string): Promise<Movie | null> {
    const movie: Movie | null = await prisma.movie.findUnique({
        where: { id: Number(id) },
    });

    if (movie) {
        const movieUpdated = await prisma.movie.update({
            where: { id: Number(id) },
            data: movieParam,
            include: { genres: { select: { genre: true } } },
        });

        if (movieUpdated) {
            return movieUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addMovie(movieParam: Prisma.MovieCreateInput): Promise<Movie | null> {
    const movieCreated = await prisma.movie.create({
        data: movieParam,
        include: { genres: { select: { genre: true } } },
    });

    if (movieCreated) {
        return movieCreated;
    } else {
        return null;
    }
}

export async function deleteMovieById(id: number): Promise<string | null> {
    const movie: Movie | null = await prisma.movie.findUnique({
        where: { id },
    });

    if (movie) {
        const result = await prisma.movie.delete({
            where: { id },
        });

        if (result) {
            return "Movie deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchMoviesByTitle(title: string, queryParams: any, userId?: number): Promise<any | null> {
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

    const movies = await prisma.movie.findMany(query);
    const movieIds = movies.map((movie: Movie) => movie.id);

    const movieRatings = await prisma.movieReview.groupBy({
        by: ["movieId"],
        where: { movieId: { in: movieIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const movieRatingsMap: RatingsMap = movieRatings.reduce((map, rating) => {
        map[rating.movieId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const moviesFinal = await Promise.all(
        movies.map(async (movie) => {
            const { ...properties } = movie;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userMovieFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { movieId: movie.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = movieRatingsMap[movie.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const count = await prisma.movie.count({
        where: {
            title: { contains: title },
        },
    });

    if (movies) {
        return { movies: moviesFinal, count };
    } else {
        return null;
    }
}
// #endregion
