import { Prisma, User } from "@prisma/client";
import { prisma } from "../prisma";

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

export const getUsers = async ({
    sortBy,
    ascOrDesc,
    perPage,
    page,
    userName,
    filterValue,
    filterNameString,
    filterOperatorString,
}: UserModelParams): Promise<{ rows: User[]; count: number } | null> => {
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
        orderByObject[sortBy as keyof any] = ascOrDesc;
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
};

export const getUserById = async (userId: number): Promise<User | null> => {
    const result = await prisma.user.findUnique({
        where: { id: userId },
    });
    return result || null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const result = await prisma.user.findFirst({
        where: { userName: username },
    });
    return result || null;
};

export const updateUserById = async (userParam: Prisma.UserUpdateInput, id: string): Promise<User | null> => {
    const result = await prisma.user.update({
        where: { id: Number(id) },
        data: userParam,
    });
    return result || null;
};

export const deleteUserById = async (id: number): Promise<string | null> => {
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
};

export const searchUsersByUsername = async (username: string, page: number): Promise<User[] | null> => {
    const result = await prisma.user.findMany({
        where: {
            userName: { contains: username },
        },
        skip: page ? (page - 1) * 20 : 0,
        take: 20,
    });
    return result || null;
};

// #region "Bookmarks"
export const addFavoriteSerieToUser = async (userId: number, serieId: number): Promise<User | null> => {
    const existingFavorite = await prisma.userSerieFavorite.findFirst({
        where: {
            userId,
            serieId,
        },
    });

    if (existingFavorite) {
        return null;
    }

    await prisma.userSerieFavorite.create({
        data: {
            userId,
            serieId,
        },
    });

    return (
        prisma.user.findUnique({
            where: { id: userId },
            include: {
                favMovies: true,
                favSeries: true,
                movieReviews: true,
                serieReviews: true,
                upvotedMovies: true,
                downvotedMovies: true,
                upvotedSeries: true,
                downvotedSeries: true,
            },
        }) || null
    );
};

export const addFavoriteMovieToUser = async (userId: number, movieId: number): Promise<User | null> => {
    const existingFavorite = await prisma.userMovieFavorite.findFirst({
        where: {
            userId,
            movieId,
        },
    });

    if (existingFavorite) {
        return null;
    }

    await prisma.userMovieFavorite.create({
        data: {
            userId,
            movieId,
        },
    });

    return (
        prisma.user.findUnique({
            where: { id: userId },
            include: {
                favMovies: true,
                favSeries: true,
                movieReviews: true,
                serieReviews: true,
                upvotedMovies: true,
                downvotedMovies: true,
                upvotedSeries: true,
                downvotedSeries: true,
            },
        }) || null
    );
};

export const removeFavoriteMovieToUser = async (userId: number, movieId: number): Promise<User | null> => {
    const existingFavorite = await prisma.userMovieFavorite.findFirst({
        where: {
            userId,
            movieId,
        },
    });

    if (existingFavorite) {
        await prisma.userMovieFavorite.delete({
            where: { id: existingFavorite.id },
        });

        return (
            prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favMovies: true,
                    favSeries: true,
                    movieReviews: true,
                    serieReviews: true,
                    upvotedMovies: true,
                    downvotedMovies: true,
                    upvotedSeries: true,
                    downvotedSeries: true,
                },
            }) || null
        );
    } else {
        return null;
    }
};

export const removeFavoriteSerieToUser = async (userId: number, serieId: number): Promise<User | null> => {
    const existingFavorite = await prisma.userSerieFavorite.findFirst({
        where: {
            userId,
            serieId,
        },
    });

    if (existingFavorite) {
        await prisma.userSerieFavorite.delete({
            where: { id: existingFavorite.id },
        });

        return (
            prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favMovies: true,
                    favSeries: true,
                    movieReviews: true,
                    serieReviews: true,
                    upvotedMovies: true,
                    downvotedMovies: true,
                    upvotedSeries: true,
                    downvotedSeries: true,
                },
            }) || null
        );
    } else {
        return null;
    }
};
// #endregion

// #region "Reviews"
export const addReviewMovie = async ({ content, createdAt, rating, userId, movieId }: any): Promise<User | null> => {
    const existingReview = await prisma.movieReview.findFirst({
        where: {
            userId,
            movieId,
        },
    });

    if (!existingReview) {
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
            return (
                prisma.user.findUnique({
                    where: { id: userId },
                    include: {
                        favMovies: true,
                        favSeries: true,
                        movieReviews: true,
                        serieReviews: true,
                        upvotedMovies: true,
                        downvotedMovies: true,
                        upvotedSeries: true,
                        downvotedSeries: true,
                    },
                }) || null
            );
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const addReviewSerie = async ({ content, createdAt, rating, userId, serieId }: any): Promise<User | null> => {
    const existingReview = await prisma.serieReview.findFirst({
        where: {
            userId,
            serieId,
        },
    });

    if (!existingReview) {
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
            return (
                prisma.user.findUnique({
                    where: { id: userId },
                    include: {
                        favMovies: true,
                        favSeries: true,
                        movieReviews: true,
                        serieReviews: true,
                        upvotedMovies: true,
                        downvotedMovies: true,
                        upvotedSeries: true,
                        downvotedSeries: true,
                    },
                }) || null
            );
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export async function updateReviewMovie({ content, updatedAt, rating, userId, movieId }: any): Promise<any> {
    const existingReview = await prisma.movieReview.findFirst({
        where: {
            AND: [{ userId }, { movieId }],
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
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favMovies: { include: { movie: true } },
                    favSeries: { include: { serie: true } },
                    movieReviews: { include: { movie: true } },
                    serieReviews: { include: { serie: true } },
                    upvotedMovies: { include: { movieReview: true, movie: true } },
                    downvotedMovies: { include: { movieReview: true, movie: true } },
                    upvotedSeries: { include: { serieReview: true, serie: true } },
                    downvotedSeries: { include: { serieReview: true, serie: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function updateReviewSerie({ content, updatedAt, rating, userId, serieId }: any): Promise<any> {
    const existingReview = await prisma.serieReview.findFirst({
        where: {
            AND: [{ userId }, { serieId }],
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
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favMovies: { include: { movie: true } },
                    favSeries: { include: { serie: true } },
                    movieReviews: { include: { movie: true } },
                    serieReviews: { include: { serie: true } },
                    upvotedMovies: { include: { movieReview: true, movie: true } },
                    downvotedMovies: { include: { movieReview: true, movie: true } },
                    upvotedSeries: { include: { serieReview: true, serie: true } },
                    downvotedSeries: { include: { serieReview: true, serie: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function removeReviewMovie({ userId, movieId }: any): Promise<any> {
    const existingReview = await prisma.movieReview.findFirst({
        where: {
            AND: [{ userId }, { movieId }],
        },
    });

    if (existingReview) {
        const result = await prisma.movieReview.delete({
            where: { id: existingReview.id },
        });

        if (result) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favMovies: { include: { movie: true } },
                    favSeries: { include: { serie: true } },
                    movieReviews: { include: { movie: true } },
                    serieReviews: { include: { serie: true } },
                    upvotedMovies: { include: { movieReview: true, movie: true } },
                    downvotedMovies: { include: { movieReview: true, movie: true } },
                    upvotedSeries: { include: { serieReview: true, serie: true } },
                    downvotedSeries: { include: { serieReview: true, serie: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function removeReviewSerie({ userId, serieId }: any): Promise<any> {
    const existingReview = await prisma.serieReview.findFirst({
        where: {
            AND: [{ userId }, { serieId }],
        },
    });

    if (existingReview) {
        const result = await prisma.serieReview.delete({
            where: { id: existingReview.id },
        });

        if (result) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    favMovies: { include: { movie: true } },
                    favSeries: { include: { serie: true } },
                    movieReviews: { include: { movie: true } },
                    serieReviews: { include: { serie: true } },
                    upvotedMovies: { include: { movieReview: true, movie: true } },
                    downvotedMovies: { include: { movieReview: true, movie: true } },
                    upvotedSeries: { include: { serieReview: true, serie: true } },
                    downvotedSeries: { include: { serieReview: true, serie: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}
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
