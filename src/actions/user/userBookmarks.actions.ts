"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/config/prisma";
import { getReferer } from "./user.actions";

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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addFavoritePersonToUser(userId: number, personId: number): Promise<void> {
    try {
        const existingFavorite = await prisma.userPersonFavorite.findFirst({
            where: {
                AND: [{ userId }, { personId }],
            },
        });

        if (existingFavorite) {
            throw new Error("This person is already in your favorites.");
        }

        const person = await prisma.person.findUnique({
            where: {
                id: personId,
            },
        });

        if (!person) {
            throw new Error("Person not found.");
        }

        const result = await prisma.userPersonFavorite.create({
            data: { userId, personId },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to add person to favorites.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeFavoritePersonToUser(userId: number, personId: number, pathFrom?: string): Promise<void> {
    try {
        const existingFavorite = await prisma.userPersonFavorite.findFirst({
            where: {
                AND: [{ userId }, { personId }],
            },
            include: {
                person: true,
            },
        });

        if (!existingFavorite) {
            throw new Error("Favorite person not found.");
        }

        const result = await prisma.userPersonFavorite.delete({
            where: { id: existingFavorite.id },
        });

        if (result) {
            if (pathFrom && pathFrom === "/profile?tab=favPersons") {
                revalidatePath("/profile?tab=favPersons");
            } else {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            }
        } else {
            throw new Error("Failed to remove person from favorites.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
// #endregion

// #endregion
