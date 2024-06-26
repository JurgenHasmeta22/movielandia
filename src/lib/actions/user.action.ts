"use server";

import { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

// #region "Interfaces"
interface UserModelParams {
    sortBy: string;
    ascOrDesc: "asc" | "desc";
    perPage: number;
    page: number;
    userName?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

interface AddReviewMovieParams {
    content: string;
    createdAt?: Date;
    rating: number;
    userId: number;
    movieId: number;
}

interface AddReviewSerieParams {
    content: string;
    createdAt?: Date;
    rating: number;
    userId: number;
    serieId: number;
}

interface UpdateReviewMovieParams {
    content: string;
    updatedAt?: Date;
    rating: number;
    userId: number;
    movieId: number;
}

interface UpdateReviewSerieParams {
    content: string;
    updatedAt?: Date;
    rating: number;
    userId: number;
    serieId: number;
}

interface RemoveReviewMovieParams {
    userId: number;
    movieId: number;
}

interface RemoveReviewSerieParams {
    userId: number;
    serieId: number;
}
// #endregion

// #region "CRUD"
export async function getUsers({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    userName,
    filterValue,
    filterNameString,
    filterOperatorString,
}: UserModelParams): Promise<any | null> {
    const filters: Prisma.UserWhereInput = {};
    const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
    const take = perPage || 20;

    if (userName) filters.userName = { contains: userName };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        (filters[filterNameString as keyof Prisma.UserWhereInput] as any) = { [operator]: filterValue };
    }

    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const users = await prisma.user.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    const count = await prisma.user.count();

    if (users) {
        return { rows: users, count };
    } else {
        return null;
    }
}

export async function getUserById(userId: number): Promise<User | null> {
    const result = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
        where: { userName: username },
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function updateUserById(userParam: Prisma.UserUpdateInput, id: string): Promise<User | null> {
    const result = await prisma.user.update({
        where: { id: Number(id) },
        data: userParam,
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}

export async function deleteUserById(id: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (user) {
        await prisma.user.delete({
            where: { id },
        });
        return "User deleted successfully";
    } else {
        return null;
    }
}

export async function searchUsersByUsername(username: string, page: number): Promise<User[] | null> {
    const result = await prisma.user.findMany({
        where: {
            userName: { contains: username },
        },
        skip: page ? (page - 1) * 20 : 0,
        take: 20,
    });

    if (result) {
        return result;
    } else {
        return null;
    }
}
// #endregion

// #region "Bookmarks"
export async function addFavoriteSerieToUser(userId: number, serieId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userSerieFavorite.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This serie is already in your favorites.");
        }

        const serie = await prisma.serie.findUnique({
            where: {
                id: serieId,
            },
        });

        if (!serie) {
            throw new Error("Serie not found.");
        }

        const result = await prisma.userSerieFavorite.create({
            data: { userId, serieId },
        });

        if (result) {
            const titleFinal = serie.title
                .split("")
                .map((char: string) => (char === " " ? "-" : char))
                .join("");

            redirect(`/series/${titleFinal}`);
        } else {
            throw new Error("Failed to add serie to favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addFavoriteMovieToUser(userId: number, movieId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userMovieFavorite.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This movie is already in your favorites.");
        }

        const movie = await prisma.movie.findUnique({
            where: {
                id: movieId,
            },
        });

        if (!movie) {
            throw new Error("Movie not found.");
        }

        const result = await prisma.userMovieFavorite.create({
            data: { userId, movieId },
        });

        if (result) {
            const titleFinal = movie.title
                .split("")
                .map((char: string) => (char === " " ? "-" : char))
                .join("");

            redirect(`/movies/${titleFinal}`);
        } else {
            throw new Error("Failed to add movie to favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeFavoriteMovieToUser(userId: number, movieId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userMovieFavorite.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
            include: {
                movie: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite movie not found.");
        }

        const result = await prisma.userMovieFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            const titleFinal = existingFavorite.movie.title
                .split("")
                .map((char: string) => (char === " " ? "-" : char))
                .join("");

            redirect(`/movies/${titleFinal}`);
        } else {
            throw new Error("Failed to remove movie from favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeFavoriteSerieToUser(userId: number, serieId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userSerieFavorite.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
            include: {
                serie: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite serie not found.");
        }

        const result = await prisma.userSerieFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            const titleFinal = existingFavorite.serie.title
                .split("")
                .map((char: string) => (char === " " ? "-" : char))
                .join("");

            redirect(`/series/${titleFinal}`);
        } else {
            throw new Error("Failed to remove serie from favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}
// #endregion

// #region "Reviews"
export const addReviewMovie = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    movieId,
}: AddReviewMovieParams): Promise<void> => {
    try {
        const existingReview = await prisma.movieReview.findFirst({
            where: {
                userId,
                movieId,
            },
        });

        if (!existingReview) {
            const movie = await prisma.movie.findUnique({
                where: {
                    id: movieId,
                },
            });

            if (!movie) {
                throw new Error("Movie not found.");
            }

            const reviewAdded = await prisma.movieReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    movieId,
                },
            });

            if (reviewAdded) {
                const titleFinal = movie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");

                redirect(`/movies/${titleFinal}`);
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this movie.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const addReviewSerie = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    serieId,
}: AddReviewSerieParams): Promise<void> => {
    try {
        const existingReview = await prisma.serieReview.findFirst({
            where: {
                userId,
                serieId,
            },
        });

        if (!existingReview) {
            const serie = await prisma.serie.findUnique({
                where: {
                    id: serieId,
                },
            });

            if (!serie) {
                throw new Error("Serie not found.");
            }

            const reviewAdded = await prisma.serieReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    serieId,
                },
            });

            if (reviewAdded) {
                const titleFinal = serie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");

                redirect(`/series/${titleFinal}`);
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this serie.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const updateReviewMovie = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    movieId,
}: UpdateReviewMovieParams): Promise<void> => {
    try {
        const existingReview = await prisma.movieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
            include: {
                movie: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.movieReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    movieId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const titleFinal = existingReview.movie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");

                redirect(`/movies/${titleFinal}`);
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const updateReviewSerie = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    serieId,
}: UpdateReviewSerieParams): Promise<void> => {
    try {
        const existingReview = await prisma.serieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
            include: {
                serie: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.serieReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    serieId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const titleFinal = existingReview.serie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");

                redirect(`/series/${titleFinal}`);
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const removeReviewMovie = async ({ userId, movieId }: RemoveReviewMovieParams): Promise<void> => {
    try {
        const existingReview = await prisma.movieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
            include: {
                movie: true,
            },
        });

        if (existingReview) {
            const result = await prisma.movieReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const titleFinal = existingReview.movie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");

                redirect(`/movies/${titleFinal}`);
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const removeReviewSerie = async ({ userId, serieId }: RemoveReviewSerieParams): Promise<void> => {
    try {
        const existingReview = await prisma.serieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
            include: {
                serie: true,
            },
        });

        if (existingReview) {
            const result = await prisma.serieReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const titleFinal = existingReview.serie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");

                redirect(`/series/${titleFinal}`);
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};
// #endregion

// #region "Upvotes, Downvotes"
export async function addUpvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
    const existingUpvoteMovieReview = await prisma.upvoteMovie.findFirst({
        where: {
            AND: [{ userId }, { movieId }, { movieReviewId }],
        },
    });

    if (!existingUpvoteMovieReview) {
        const upvoteAdded = await prisma.upvoteMovie.create({
            data: {
                userId,
                movieId,
                movieReviewId,
            },
        });

        if (upvoteAdded) {
            return upvoteAdded;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addUpvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
    const existingUpvoteSerieReview = await prisma.upvoteSerie.findFirst({
        where: {
            AND: [{ userId }, { serieId }, { serieReviewId }],
        },
    });

    if (!existingUpvoteSerieReview) {
        const upvoteAdded = await prisma.upvoteSerie.create({
            data: {
                userId,
                serieId,
                serieReviewId,
            },
        });

        if (upvoteAdded) {
            return upvoteAdded;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function removeUpvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
    const existingUpvote = await prisma.upvoteMovie.findFirst({
        where: {
            AND: [{ userId }, { movieReviewId }, { movieId }],
        },
    });

    if (existingUpvote) {
        const result = await prisma.upvoteMovie.delete({
            where: { id: existingUpvote.id },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function removeUpvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
    const existingUpvote = await prisma.upvoteSerie.findFirst({
        where: {
            AND: [{ userId }, { serieReviewId }, { serieId }],
        },
    });

    if (existingUpvote) {
        const result = await prisma.upvoteSerie.delete({
            where: { id: existingUpvote.id },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addDownvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
    const existingDownvoteMovieReview = await prisma.downvoteMovie.findFirst({
        where: {
            AND: [{ userId }, { movieId }, { movieReviewId }],
        },
    });

    if (!existingDownvoteMovieReview) {
        const downvoteAdded = await prisma.downvoteMovie.create({
            data: {
                userId,
                movieId,
                movieReviewId,
            },
        });

        if (downvoteAdded) {
            return downvoteAdded;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addDownvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
    const existingDownvoteSerieReview = await prisma.downvoteSerie.findFirst({
        where: {
            AND: [{ userId }, { serieId }, { serieReviewId }],
        },
    });

    if (!existingDownvoteSerieReview) {
        const downvoteAdded = await prisma.downvoteSerie.create({
            data: {
                userId,
                serieId,
                serieReviewId,
            },
        });

        if (downvoteAdded) {
            return downvoteAdded;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function removeDownvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
    const existingDownvote = await prisma.downvoteMovie.findFirst({
        where: {
            AND: [{ userId }, { movieReviewId }, { movieId }],
        },
    });

    if (existingDownvote) {
        const result = await prisma.downvoteMovie.delete({
            where: { id: existingDownvote.id },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function removeDownvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
    const existingDownvote = await prisma.downvoteSerie.findFirst({
        where: {
            AND: [{ userId }, { serieReviewId }, { serieId }],
        },
    });

    if (existingDownvote) {
        const result = await prisma.downvoteSerie.delete({
            where: { id: existingDownvote.id },
        });

        if (result) {
            return result;
        } else {
            return null;
        }
    } else {
        return null;
    }
}
// #endregion
