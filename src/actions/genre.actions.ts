"use server";

import { Genre, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";

type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

interface GetGenresParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    name?: string;
    type?: string;
    filterValue?: any;
    filterNameString?: string;
    filterOperatorString?: ">" | "=" | "<";
}

// #region "GET Methods"
export async function getGenresWithFilters({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    name,
    filterValue,
    filterNameString,
    filterOperatorString,
}: GetGenresParams): Promise<any | null> {
    const filters: any = {};
    let skip = 0;
    let take = undefined;

    if (page !== undefined) {
        skip = perPage ? (page - 1) * perPage : 0;
        take = perPage || 10;
    }

    if (name) filters.name = { contains: name };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const genres = await prisma.genre.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    const count = await prisma.genre.count();

    if (genres) {
        return { rows: genres, count };
    } else {
        return null;
    }
}

export async function getGenres(): Promise<any | null> {
    const genres = await prisma.genre.findMany();

    if (genres) {
        return genres;
    } else {
        return null;
    }
}

export async function getGenreById(
    genreId: number,
    {
        sortBy,
        ascOrDesc,
        perPage,
        page,
        name,
        type,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: GetGenresParams,
    userId?: number,
): Promise<any | null> {
    const filters: any = {};
    const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
    const take = perPage || 20;

    if (name) filters.name = { contains: name };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const genre = await prisma.genre.findFirst({
        where: {
            id: genreId,
        },
    });

    if (genre) {
        if (type === "movie") {
            const result = await prisma.movieGenre.findMany({
                where: {
                    genreId: genre?.id,
                },
                orderBy: {
                    movie: orderByObject,
                },
                skip,
                take,
                select: {
                    movie: true,
                },
            });

            const count = await prisma.movieGenre.count({
                where: {
                    genreId: genre?.id,
                },
            });

            if (result) {
                const movies = result.map((item) => item.movie);
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

                const formattedMovies = await Promise.all(
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

                return { genre, movies: formattedMovies, count };
            }
        } else if (type === "serie") {
            const result = await prisma.serieGenre.findMany({
                where: {
                    genreId: genre?.id,
                },
                orderBy: {
                    serie: orderByObject,
                },
                skip,
                take,
                select: {
                    serie: true,
                },
            });

            const count = await prisma.serieGenre.count({
                where: {
                    genreId: genre?.id,
                },
            });

            if (result) {
                const series = result.map((item) => item.serie);
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

                const formattedSeries = await Promise.all(
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

                return { series: formattedSeries, count };
            }
        } else {
            return null;
        }
    } else {
        throw new Error("Genre not found");
    }
}

export async function getGenreByName(
    nameGenre: string,
    {
        sortBy,
        ascOrDesc,
        perPage,
        page,
        name,
        type,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: GetGenresParams,
): Promise<any | null> {
    const filters: any = {};
    const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
    const take = perPage || 20;

    if (name) filters.name = { contains: name };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const genre = await prisma.genre.findFirst({
        where: {
            name: {
                equals: nameGenre,
            },
        },
    });

    if (genre) {
        if (type === "movie") {
            const result = await prisma.movieGenre.findMany({
                where: {
                    genreId: genre?.id,
                },
                orderBy: {
                    movie: orderByObject,
                },
                skip,
                take,
                select: {
                    movie: { include: { genres: { select: { genre: true } } } },
                },
            });

            const count = await prisma.movieGenre.count({
                where: {
                    genreId: genre?.id,
                },
            });

            if (result) {
                const movies = result.map((item) => item.movie);
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

                type RatingsMap = {
                    [key: number]: {
                        averageRating: number;
                        totalReviews: number;
                    };
                };

                const movieRatingsMap: RatingsMap = movieRatings.reduce((map, rating) => {
                    map[rating.movieId] = {
                        averageRating: rating._avg.rating || 0,
                        totalReviews: rating._count.rating,
                    };

                    return map;
                }, {} as RatingsMap);

                const formattedMovies = movies.map((movie) => {
                    const { genres, ...properties } = movie;
                    const simplifiedGenres = genres.map((genre) => genre.genre);
                    const ratingsInfo = movieRatingsMap[movie.id] || { averageRating: 0, totalReviews: 0 };

                    return { ...properties, genres: simplifiedGenres, ...ratingsInfo };
                });

                return { movies: formattedMovies, count };
            }
        } else if (type === "serie") {
            const result = await prisma.serieGenre.findMany({
                where: {
                    genreId: genre?.id,
                },
                orderBy: {
                    serie: orderByObject,
                },
                skip,
                take,
                select: {
                    serie: { include: { genres: { select: { genre: true } } } },
                },
            });

            const count = await prisma.serieGenre.count({
                where: {
                    genreId: genre?.id,
                },
            });

            if (result) {
                const series = result.map((item) => item.serie);
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

                const formattedSeries = series.map((serie) => {
                    const { genres, ...properties } = serie;
                    const simplifiedGenres = genres.map((genre) => genre.genre);
                    const ratingsInfo = serieRatingsMap[serie.id] || { averageRating: 0, totalReviews: 0 };

                    return { ...properties, genres: simplifiedGenres, ...ratingsInfo };
                });

                return { series: formattedSeries, count };
            }
        } else {
            return null;
        }
    } else {
        throw new Error("Genre not found");
    }
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function addGenre(genreData: Prisma.GenreCreateInput): Promise<Genre | null> {
    const genre = await prisma.genre.create({
        data: genreData,
        include: {
            movies: {
                select: {
                    movie: true,
                },
            },
        },
    });

    if (genre) {
        return genre;
    } else {
        return null;
    }
}

export async function updateGenreById(genreData: Prisma.GenreUpdateInput, id: string): Promise<Genre | null> {
    const genreUpdated = await prisma.genre.update({
        where: {
            id: parseInt(id),
        },
        data: genreData,
        include: {
            movies: {
                select: {
                    movie: true,
                },
            },
        },
    });

    if (genreUpdated) {
        return genreUpdated;
    } else {
        return null;
    }
}

export async function deleteGenreById(id: number): Promise<string | null> {
    try {
        const genreDeleted = await prisma.genre.delete({
            where: {
                id,
            },
        });

        if (genreDeleted) {
            return "Genre deleted successfully";
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Failed to delete genre");
    }
}

export async function searchGenresByName(name: string, page: number): Promise<Genre[] | null> {
    const perPage = 20;
    const skip = perPage * (page - 1);
    const genres = await prisma.genre.findMany({
        where: {
            name: {
                contains: name,
            },
        },
        orderBy: {
            name: "asc",
        },
        skip,
        take: perPage,
    });

    if (genres) {
        return genres;
    } else {
        return null;
    }
}
// #endregion
