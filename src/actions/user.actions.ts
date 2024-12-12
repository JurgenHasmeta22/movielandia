"use server";

import { headers } from "next/headers";
import { Prisma, User } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect";
import { prisma } from "../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { FilterOperator } from "@/types/filterOperators";

// #region "Interfaces"
interface UserModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
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

interface RemoveReviewSeasonParams {
    userId: number;
    seasonId: number;
}

interface RemoveReviewEpisodeParams {
    userId: number;
    episodeId: number;
}

interface RemoveReviewActorParams {
    userId: number;
    actorId: number;
}

interface RemoveReviewCrewParams {
    userId: number;
    crewId: number;
}

interface VoteMovieReviewParams {
    userId: number;
    movieId: number;
    movieReviewId: number;
}

interface VoteSerieReviewParams {
    userId: number;
    serieId: number;
    serieReviewId: number;
}

interface VoteSeasonReviewParams {
    userId: number;
    seasonId: number;
    seasonReviewId: number;
}

interface VoteEpisodeReviewParams {
    userId: number;
    episodeId: number;
    episodeReviewId: number;
}

interface VoteActorReviewParams {
    userId: number;
    actorId: number;
    actorReviewId: number;
}

interface VoteCrewReviewParams {
    userId: number;
    crewId: number;
    crewReviewId: number;
}

interface UserModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    userName?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

// #endregion

// #region "Utils"
function getReferer() {
    const headersList = headers() as any;
    const referer = headersList.get("referer");

    if (referer) {
        return referer;
    } else {
        return "/";
    }
}
// #endregion

// #region "CRUD"

// #region "GET Methods"
export async function getUsersWithFilters({
    sortBy,
    ascOrDesc,
    perPage = 12,
    page = 1,
    userName,
    filterValue,
    filterNameString,
    filterOperatorString,
}: UserModelParams): Promise<{ users: User[]; count: number }> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (userName) filters.userName = { contains: userName };

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

    const users = await prisma.user.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    const usersCount = await prisma.user.count();

    return { users, count: usersCount };
}

export async function getUsers(): Promise<any | null> {
    const users = await prisma.user.findMany();

    if (users) {
        return users;
    } else {
        return null;
    }
}

export async function getUserById(userId: number, userLoggedInId?: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            avatar: true,
        },
    });

    if (user) {
        let isFollowed: boolean = false;
        let isFollowedStatus: string | null = null;

        if (userLoggedInId) {
            const existingFollow = await prisma.userFollow.findFirst({
                where: {
                    followerId: userLoggedInId,
                    followingId: userId,
                },
            });

            if (existingFollow) {
                isFollowed = true;
                isFollowedStatus = existingFollow.state;
            }
        }

        return { ...user, ...(userLoggedInId && { isFollowed, isFollowedStatus }) };
    }

    return null;
}

export async function getUsernameByUserId(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { userName: true },
    });

    try {
        if (user) {
            return user.userName;
        } else {
            throw new Error("User not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function getUserByUsername(userName: string, userLoggedInId: number): Promise<User | null> {
    const user = await prisma.user.findFirst({
        where: { userName },
        include: {
            avatar: true,
        },
    });

    if (user) {
        let isFollowed: boolean = false;
        let isFollowedStatus: string | null = null;

        if (userLoggedInId) {
            const existingFollow = await prisma.userFollow.findFirst({
                where: {
                    followerId: userLoggedInId,
                },
            });

            if (existingFollow) {
                isFollowed = true;
                isFollowedStatus = existingFollow.state;
            }
        }

        return { ...user, ...(userLoggedInId && { isFollowed, isFollowedStatus }) };
    } else {
        return null;
    }
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updateUserByIdAdmin(userParam: Prisma.UserUpdateInput, id: number): Promise<User | null> {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: userParam,
        });

        if (updatedUser) {
            return updatedUser;
            // revalidatePath(`/users/${updatedUser.id}/${updatedUser.userName}`, "page");
        } else {
            // throw new Error("Failed to update user.");
            return null;
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function updateUserById(userParam: Prisma.UserUpdateInput, id: number): Promise<void> {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: userParam,
        });

        if (updatedUser) {
            revalidatePath(`/users/${updatedUser.id}/${updatedUser.userName}`, "page");
        } else {
            throw new Error("Failed to update user.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
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

export async function searchUsersByUsername(userName: string, queryParams: any): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const query = {
        where: {
            userName: { contains: userName },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
    };

    const users = await prisma.user.findMany(query);

    const count = await prisma.user.count({
        where: {
            userName: { contains: userName },
        },
    });

    if (users) {
        return { users, count };
    } else {
        return null;
    }
}
// #endregion

// #endregion

// #region "Bookmarks"

// #region "Add Favorite"
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
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
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
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
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

export async function addFavoriteSeasonToUser(userId: number, seasonId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userSeasonFavorite.findFirst({
            where: {
                AND: [{ userId }, { seasonId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This season is already in your favorites.");
        }

        const season = await prisma.season.findUnique({
            where: {
                id: seasonId,
            },
        });

        if (!season) {
            throw new Error("Season not found.");
        }

        const result = await prisma.userSeasonFavorite.create({
            data: { userId, seasonId },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to add season to favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addFavoriteEpisodeToUser(userId: number, episodeId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userEpisodeFavorite.findFirst({
            where: {
                AND: [{ userId }, { episodeId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This episode is already in your favorites.");
        }

        const episode = await prisma.episode.findUnique({
            where: {
                id: episodeId,
            },
        });

        if (!episode) {
            throw new Error("Episode not found.");
        }

        const result = await prisma.userEpisodeFavorite.create({
            data: { userId, episodeId },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to add episode to favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addFavoriteActorToUser(userId: number, actorId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userActorFavorite.findFirst({
            where: {
                AND: [{ userId }, { actorId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This actor is already in your favorites.");
        }

        const actor = await prisma.actor.findUnique({
            where: {
                id: actorId,
            },
        });

        if (!actor) {
            throw new Error("Actor not found.");
        }

        const result = await prisma.userActorFavorite.create({
            data: { userId, actorId },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to add actor to favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addFavoriteCrewToUser(userId: number, crewId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userCrewFavorite.findFirst({
            where: {
                AND: [{ userId }, { crewId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This crew is already in your favorites.");
        }

        const crew = await prisma.crew.findUnique({
            where: {
                id: crewId,
            },
        });

        if (!crew) {
            throw new Error("crew not found.");
        }

        const result = await prisma.userCrewFavorite.create({
            data: { userId, crewId },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to add crew to favorites.");
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

// #region "Remove Favorite"
export async function removeFavoriteMovieToUser(userId: number, movieId: number, pathFrom: string): Promise<void> {
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
            if (pathFrom === "/profile?tab=favMovies") {
                revalidatePath("/profile?tab=favMovies");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
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

export async function removeFavoriteSerieToUser(userId: number, serieId: number, pathFrom: string): Promise<void> {
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
            if (pathFrom === "/profile?tab=favSeries") {
                revalidatePath("/profile?tab=favSeries");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
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

export async function removeFavoriteSeasonToUser(userId: number, seasonId: number, pathFrom: string): Promise<void> {
    try {
        const existingFavorite = await prisma.userSeasonFavorite.findFirst({
            where: {
                AND: [{ userId }, { seasonId }],
            },
            include: {
                season: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite season not found.");
        }

        const result = await prisma.userSeasonFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            if (pathFrom === "/profile?tab=favSeasons") {
                revalidatePath("/profile?tab=favSeasons");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
        } else {
            throw new Error("Failed to remove season from favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeFavoriteEpisodeToUser(userId: number, episodeId: number, pathFrom: string): Promise<void> {
    try {
        const existingFavorite = await prisma.userEpisodeFavorite.findFirst({
            where: {
                AND: [{ userId }, { episodeId }],
            },
            include: {
                episode: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite episode not found.");
        }

        const result = await prisma.userEpisodeFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            if (pathFrom === "/profile?tab=favEpisodes") {
                revalidatePath("/profile?tab=favEpisodes");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
        } else {
            throw new Error("Failed to remove episode from favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeFavoriteActorToUser(userId: number, actorId: number, pathFrom?: string): Promise<void> {
    try {
        const existingFavorite = await prisma.userActorFavorite.findFirst({
            where: {
                AND: [{ userId }, { actorId }],
            },
            include: {
                actor: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite actor not found.");
        }

        const result = await prisma.userActorFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            if (pathFrom && pathFrom === "/profile?tab=favActors") {
                revalidatePath("/profile?tab=favActors");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
        } else {
            throw new Error("Failed to remove actor from favorites.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeFavoriteCrewToUser(userId: number, crewId: number, pathFrom?: string): Promise<void> {
    try {
        const existingFavorite = await prisma.userCrewFavorite.findFirst({
            where: {
                AND: [{ userId }, { crewId }],
            },
            include: {
                crew: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite crew not found.");
        }

        const result = await prisma.userCrewFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            if (pathFrom && pathFrom === "/profile?tab=favCrew") {
                revalidatePath("/profile?tab=favCrew");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
        } else {
            throw new Error("Failed to remove crew from favorites.");
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

// #endregion

// #region "Reviews"

// #region "Add Review"
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
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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

export const addReviewSeason = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    seasonId,
}: Prisma.SeasonReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.seasonReview.findFirst({
            where: {
                userId,
                seasonId,
            },
        });

        if (!existingReview) {
            const season = await prisma.season.findUnique({
                where: {
                    id: seasonId,
                },
            });

            if (!season) {
                throw new Error("Season not found.");
            }

            const reviewAdded = await prisma.seasonReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    seasonId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this season.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const addReviewEpisode = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    episodeId,
}: Prisma.EpisodeReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.episodeReview.findFirst({
            where: {
                userId,
                episodeId,
            },
        });

        if (!existingReview) {
            const episode = await prisma.episode.findUnique({
                where: {
                    id: episodeId,
                },
            });

            if (!episode) {
                throw new Error("Episode not found.");
            }

            const reviewAdded = await prisma.episodeReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    episodeId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this episode.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const addReviewActor = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    actorId,
}: Prisma.ActorReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.actorReview.findFirst({
            where: {
                userId,
                actorId,
            },
        });

        if (!existingReview) {
            const actor = await prisma.actor.findUnique({
                where: {
                    id: actorId,
                },
            });

            if (!actor) {
                throw new Error("Actor not found.");
            }

            const reviewAdded = await prisma.actorReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    actorId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this actor.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const addReviewCrew = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    crewId,
}: Prisma.CrewReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.crewReview.findFirst({
            where: {
                userId,
                crewId,
            },
        });

        if (!existingReview) {
            const crew = await prisma.crew.findUnique({
                where: {
                    id: crewId,
                },
            });

            if (!crew) {
                throw new Error("Crew not found.");
            }

            const reviewAdded = await prisma.crewReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    crewId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this crew.");
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

// #region "Update Review"
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
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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

export const updateReviewSeason = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    seasonId,
}: Prisma.SeasonReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.seasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }],
            },
            include: {
                season: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.seasonReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    seasonId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Season not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const updateReviewEpisode = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    episodeId,
}: Prisma.EpisodeReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.episodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }],
            },
            include: {
                episode: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.episodeReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    episodeId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Episode not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const updateReviewActor = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    actorId,
}: Prisma.ActorReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.actorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }],
            },
            include: {
                actor: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.actorReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    actorId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Actor not found.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
};

export const updateReviewCrew = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    crewId,
}: Prisma.CrewReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.crewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }],
            },
            include: {
                crew: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.crewReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    crewId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Crew not found.");
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

// #region "Remove Review"
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
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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

export const removeReviewSeason = async ({ userId, seasonId }: RemoveReviewSeasonParams): Promise<void> => {
    try {
        const existingReview = await prisma.seasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }],
            },
            include: {
                season: true,
            },
        });

        if (existingReview) {
            const result = await prisma.seasonReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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

export const removeReviewEpisode = async ({ userId, episodeId }: RemoveReviewEpisodeParams): Promise<void> => {
    try {
        const existingReview = await prisma.episodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }],
            },
            include: {
                episode: true,
            },
        });

        if (existingReview) {
            const result = await prisma.episodeReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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

export const removeReviewActor = async ({ userId, actorId }: RemoveReviewActorParams): Promise<void> => {
    try {
        const existingReview = await prisma.actorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }],
            },
            include: {
                actor: true,
            },
        });

        if (existingReview) {
            const result = await prisma.actorReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
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

export const removeReviewCrew = async ({ userId, crewId }: RemoveReviewCrewParams): Promise<void> => {
    try {
        const existingReview = await prisma.crewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }],
            },
            include: {
                crew: true,
            },
        });

        if (existingReview) {
            const result = await prisma.crewReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Crew not found.");
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

// #endregion

// #region "Upvotes, Downvotes"

// #region "Upvotes"

// #region "Add Upvote"
export async function addUpvoteMovieReview({ userId, movieId, movieReviewId }: VoteMovieReviewParams): Promise<any> {
    try {
        const existingUpvoteMovieReview = await prisma.upvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }, { movieReviewId }],
            },
        });

        if (!existingUpvoteMovieReview) {
            const upvoteAdded = await prisma.upvoteMovieReview.create({
                data: {
                    userId,
                    movieId,
                    movieReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote movie");
            }
        } else {
            throw new Error("Failed to upvote movie");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addUpvoteSerieReview({ userId, serieId, serieReviewId }: VoteSerieReviewParams): Promise<any> {
    try {
        const existingUpvoteSerieReview = await prisma.upvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }, { serieReviewId }],
            },
        });

        if (!existingUpvoteSerieReview) {
            const upvoteAdded = await prisma.upvoteSerieReview.create({
                data: {
                    userId,
                    serieId,
                    serieReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote serie");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addUpvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingUpvoteSeasonReview = await prisma.upvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }, { seasonReviewId }],
            },
        });

        if (!existingUpvoteSeasonReview) {
            const upvoteAdded = await prisma.upvoteSeasonReview.create({
                data: {
                    userId,
                    seasonId,
                    seasonReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote season");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addUpvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingUpvoteEpisodeReview = await prisma.upvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }, { episodeReviewId }],
            },
        });

        if (!existingUpvoteEpisodeReview) {
            const upvoteAdded = await prisma.upvoteEpisodeReview.create({
                data: {
                    userId,
                    episodeId,
                    episodeReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote episode");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addUpvoteActorReview({ userId, actorId, actorReviewId }: VoteActorReviewParams): Promise<any> {
    try {
        const existingUpvoteActorReview = await prisma.upvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }, { actorReviewId }],
            },
        });

        if (!existingUpvoteActorReview) {
            const upvoteAdded = await prisma.upvoteActorReview.create({
                data: {
                    userId,
                    actorId,
                    actorReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote actor");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addUpvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingUpvoteCrewReview = await prisma.upvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }, { crewReviewId }],
            },
        });

        if (!existingUpvoteCrewReview) {
            const upvoteAdded = await prisma.upvoteCrewReview.create({
                data: {
                    userId,
                    crewId,
                    crewReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote crew");
            }
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

// #region "Remove Upvote"
export async function removeUpvoteMovieReview({ userId, movieId, movieReviewId }: VoteMovieReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieReviewId }, { movieId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteMovieReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote movie");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeUpvoteSerieReview({ userId, serieId, serieReviewId }: VoteSerieReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieReviewId }, { serieId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteSerieReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote serie");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeUpvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonReviewId }, { seasonId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteSeasonReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote season");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeUpvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeReviewId }, { episodeId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteEpisodeReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote episode");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeUpvoteActorReview({ userId, actorId, actorReviewId }: VoteActorReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorReviewId }, { actorId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteActorReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote actor");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeUpvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewReviewId }, { crewId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteCrewReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote crew");
            }
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

// #endregion

// #region "Downvotes"

// #region "Add Downvote"
export async function addDownvoteMovieReview({ userId, movieId, movieReviewId }: VoteMovieReviewParams): Promise<any> {
    try {
        const existingDownvoteMovieReview = await prisma.downvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }, { movieReviewId }],
            },
        });

        if (!existingDownvoteMovieReview) {
            const downvoteAdded = await prisma.downvoteMovieReview.create({
                data: {
                    userId,
                    movieId,
                    movieReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote movie");
            }
        } else {
            throw new Error("Failed to downvote movie");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addDownvoteSerieReview({ userId, serieId, serieReviewId }: VoteSerieReviewParams): Promise<any> {
    try {
        const existingDownvoteSerieReview = await prisma.downvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }, { serieReviewId }],
            },
        });

        if (!existingDownvoteSerieReview) {
            const downvoteAdded = await prisma.downvoteSerieReview.create({
                data: {
                    userId,
                    serieId,
                    serieReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote serie");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addDownvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingDownvoteSeasonReview = await prisma.downvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }, { seasonReviewId }],
            },
        });

        if (!existingDownvoteSeasonReview) {
            const downvoteAdded = await prisma.downvoteSeasonReview.create({
                data: {
                    userId,
                    seasonId,
                    seasonReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote season");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addDownvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingDownvoteEpisodeReview = await prisma.downvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }, { episodeReviewId }],
            },
        });

        if (!existingDownvoteEpisodeReview) {
            const downvoteAdded = await prisma.downvoteEpisodeReview.create({
                data: {
                    userId,
                    episodeId,
                    episodeReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote episode");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addDownvoteActorReview({ userId, actorId, actorReviewId }: VoteActorReviewParams): Promise<any> {
    try {
        const existingDownvoteActorReview = await prisma.downvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }, { actorReviewId }],
            },
        });

        if (!existingDownvoteActorReview) {
            const downvoteAdded = await prisma.downvoteActorReview.create({
                data: {
                    userId,
                    actorId,
                    actorReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote actor");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function addDownvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingDownvoteCrewReview = await prisma.downvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }, { crewReviewId }],
            },
        });

        if (!existingDownvoteCrewReview) {
            const downvoteAdded = await prisma.downvoteCrewReview.create({
                data: {
                    userId,
                    crewId,
                    crewReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote crew");
            }
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

// #region "Remove Downvote"
export async function removeDownvoteMovieReview({
    userId,
    movieId,
    movieReviewId,
}: VoteMovieReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieReviewId }, { movieId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteMovieReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote movie");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeDownvoteSerieReview({
    userId,
    serieId,
    serieReviewId,
}: VoteSerieReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieReviewId }, { serieId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteSerieReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote serie");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeDownvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonReviewId }, { seasonId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteSeasonReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote season");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeDownvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeReviewId }, { episodeId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteEpisodeReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote episode");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeDownvoteActorReview({
    userId,
    actorId,
    actorReviewId,
}: VoteActorReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorReviewId }, { actorId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteActorReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote actor");
            }
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function removeDownvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewReviewId }, { crewId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteCrewReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote crew");
            }
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

//#endregion

// #endregion

// #region "Follow, Unfollow"
export async function follow(followerId: number, followingId: number): Promise<void> {
    try {
        if (followerId === followingId) {
            throw new Error("You cannot follow yourself.");
        }

        const existingFollow = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }],
            },
        });

        if (existingFollow) {
            throw new Error("You already follow this user.");
        }

        const result = await prisma.userFollow.create({
            data: {
                followerId,
                followingId,
                state: "pending",
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to follow user.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function unfollow(followerId: number, followingId: number): Promise<void> {
    try {
        if (followerId === followingId) {
            throw new Error("You cannot unfollow yourself.");
        }

        const existingFollow = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }],
            },
        });

        if (!existingFollow) {
            throw new Error("You do not follow this user.");
        }

        const result = await prisma.userFollow.delete({
            where: {
                id: existingFollow.id,
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to unfollow user.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function acceptFollowRequest(followerId: number, followingId: number): Promise<void> {
    try {
        const followRequest = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }, { state: "pending" }],
            },
        });

        if (!followRequest) {
            throw new Error("No pending follow request found.");
        }

        const result = await prisma.userFollow.update({
            where: {
                id: followRequest.id,
            },
            data: {
                state: "accepted",
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to accept follow request.");
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        } else {
            throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

export async function refuseFollowRequest(followerId: number, followingId: number): Promise<void> {
    try {
        const followRequest = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }, { state: "pending" }],
            },
        });

        if (!followRequest) {
            throw new Error("No pending follow request found.");
        }

        const result = await prisma.userFollow.delete({
            where: {
                id: followRequest.id,
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to refuse follow request.");
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

// #region "User favorites, reviews, votes"
export async function getUserFavorites(
    userId: number,
    subTab: "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);

    const [items, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`]: {
                    include: {
                        [singularSubTab]: true,
                    },
                    take: limit,
                    skip,
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`_count`]: {
                    select: {
                        [`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`]: true,
                    },
                },
            },
        }),
    ]);

    return {
        items: items?.[`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`] || [],
        total: total?._count?.[`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`] || 0,
    };
}

export async function getUserReviews(
    userId: number,
    subTab: "movies" | "series" | "seasons" | "episodes" | "actors" | "crew",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);

    const [reviews, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`${singularSubTab}Reviews`]: {
                    include: {
                        [singularSubTab]: true,
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                    take: limit,
                    skip,
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`_count`]: {
                    select: {
                        [`${singularSubTab}Reviews`]: true,
                    },
                },
            },
        }),
    ]);

    return {
        items: reviews?.[`${singularSubTab}Reviews`] || [],
        total: total?._count?.[`${singularSubTab}Reviews`] || 0,
    };
}

export async function getUserVotes(
    userId: number,
    subTab: "movies" | "series" | "seasons" | "episodes" | "actors" | "crew",
    mainTab: "upvotes" | "downvotes",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);
    const type = mainTab === "upvotes" ? "upvoted" : mainTab === "downvotes" ? "downvoted" : mainTab;

    const [votes, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`]: {
                    include: {
                        [`${singularSubTab}Review`]: {
                            include: {
                                user: { include: { avatar: true } },
                                [singularSubTab]: true,
                                _count: {
                                    select: {
                                        upvotes: true,
                                        downvotes: true,
                                    },
                                },
                            },
                        },
                        [singularSubTab]: true,
                    },
                    take: limit,
                    skip,
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`_count`]: {
                    select: {
                        [`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`]: true,
                    },
                },
            },
        }),
    ]);

    return {
        items: votes?.[`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`] || [],
        total: total?._count?.[`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0,
    };
}
// #endregion

// #region "Get Followers and Following"
export async function getFollowers(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
        prisma.userFollow.findMany({
            where: {
                followingId: userId,
                state: "accepted",
            },
            include: {
                follower: {
                    include: {
                        avatar: true,
                    },
                },
            },
            take: limit,
            skip,
        }),
        prisma.userFollow.count({
            where: {
                followingId: userId,
                state: "accepted",
            },
        }),
    ]);

    return {
        items: followers || [],
        total: total || 0,
    };
}

export async function getFollowing(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
        prisma.userFollow.findMany({
            where: {
                followerId: userId,
                state: "accepted",
            },
            include: {
                following: {
                    include: {
                        avatar: true,
                    },
                },
            },
            take: limit,
            skip,
        }),
        prisma.userFollow.count({
            where: {
                followerId: userId,
                state: "accepted",
            },
        }),
    ]);

    return {
        items: following || [],
        total: total || 0,
    };
}

export async function getPendingFollowRequests(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [pendingRequests, total] = await Promise.all([
        prisma.userFollow.findMany({
            where: {
                followingId: userId,
                state: "pending",
            },
            include: {
                follower: {
                    include: {
                        avatar: true,
                    },
                },
            },
            take: limit,
            skip,
        }),
        prisma.userFollow.count({
            where: {
                followingId: userId,
                state: "pending",
            },
        }),
    ]);

    return {
        items: pendingRequests || [],
        total: total || 0,
    };
}
// #endregion
