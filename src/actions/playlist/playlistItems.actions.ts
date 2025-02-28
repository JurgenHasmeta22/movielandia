"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

interface AddItemParams {
    playlistId: number;
    userId: number;
    note?: string;
}

// #region "Movie Items"
export async function addMovieToPlaylist(movieId: number, { playlistId, userId, note }: AddItemParams) {
    try {
        const [playlist, existingItem] = await Promise.all([
            prisma.playlist.findFirst({
                where: {
                    id: playlistId,
                    OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
                },
            }),
            prisma.playlistMovie.findUnique({
                where: {
                    playlistId_movieId: {
                        playlistId,
                        movieId,
                    },
                },
            }),
        ]);

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        if (existingItem) {
            throw new Error("Movie already exists in playlist");
        }

        await prisma.$transaction([
            prisma.playlistMovie.create({
                data: {
                    playlistId,
                    movieId,
                    userId,
                    note,
                    orderIndex: await prisma.playlistMovie.count({ where: { playlistId } }),
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { increment: 1 } },
            }),
            prisma.playlistActivityMovie.create({
                data: {
                    playlistId,
                    movieId,
                    userId,
                    actionType: "ItemAdded",
                    metadata: { note },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to add movie to playlist");
    }
}

export async function removeMovieFromPlaylist(movieId: number, playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        await prisma.$transaction([
            prisma.playlistMovie.delete({
                where: {
                    playlistId_movieId: {
                        playlistId,
                        movieId,
                    },
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { decrement: 1 } },
            }),
            prisma.playlistActivityMovie.create({
                data: {
                    playlistId,
                    movieId,
                    userId,
                    actionType: "ItemRemoved",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to remove movie from playlist");
    }
}
// #endregion

// #region "Serie Items"
export async function addSerieToPlaylist(serieId: number, { playlistId, userId, note }: AddItemParams) {
    try {
        const [playlist, existingItem] = await Promise.all([
            prisma.playlist.findFirst({
                where: {
                    id: playlistId,
                    OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
                },
            }),
            prisma.playlistSerie.findUnique({
                where: {
                    playlistId_serieId: {
                        playlistId,
                        serieId,
                    },
                },
            }),
        ]);

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        if (existingItem) {
            throw new Error("Serie already exists in playlist");
        }

        await prisma.$transaction([
            prisma.playlistSerie.create({
                data: {
                    playlistId,
                    serieId,
                    userId,
                    note,
                    orderIndex: await prisma.playlistSerie.count({ where: { playlistId } }),
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { increment: 1 } },
            }),
            prisma.playlistActivitySerie.create({
                data: {
                    playlistId,
                    serieId,
                    userId,
                    actionType: "ItemAdded",
                    metadata: { note },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to add serie to playlist");
    }
}

export async function removeSerieFromPlaylist(serieId: number, playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        await prisma.$transaction([
            prisma.playlistSerie.delete({
                where: {
                    playlistId_serieId: {
                        playlistId,
                        serieId,
                    },
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { decrement: 1 } },
            }),
            prisma.playlistActivitySerie.create({
                data: {
                    playlistId,
                    serieId,
                    userId,
                    actionType: "ItemRemoved",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to remove serie from playlist");
    }
}
// #endregion

// #region "Season Items"
export async function addSeasonToPlaylist(seasonId: number, { playlistId, userId, note }: AddItemParams) {
    try {
        const [playlist, existingItem] = await Promise.all([
            prisma.playlist.findFirst({
                where: {
                    id: playlistId,
                    OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
                },
            }),
            prisma.playlistSeason.findUnique({
                where: {
                    playlistId_seasonId: {
                        playlistId,
                        seasonId,
                    },
                },
            }),
        ]);

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        if (existingItem) {
            throw new Error("Season already exists in playlist");
        }

        await prisma.$transaction([
            prisma.playlistSeason.create({
                data: {
                    playlistId,
                    seasonId,
                    userId,
                    note,
                    orderIndex: await prisma.playlistSeason.count({ where: { playlistId } }),
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { increment: 1 } },
            }),
            prisma.playlistActivitySeason.create({
                data: {
                    playlistId,
                    seasonId,
                    userId,
                    actionType: "ItemAdded",
                    metadata: { note },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to add season to playlist");
    }
}

export async function removeSeasonFromPlaylist(seasonId: number, playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        await prisma.$transaction([
            prisma.playlistSeason.delete({
                where: {
                    playlistId_seasonId: {
                        playlistId,
                        seasonId,
                    },
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { decrement: 1 } },
            }),
            prisma.playlistActivitySeason.create({
                data: {
                    playlistId,
                    seasonId,
                    userId,
                    actionType: "ItemRemoved",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to remove season from playlist");
    }
}
// #endregion

// #region "Episode Items"
export async function addEpisodeToPlaylist(episodeId: number, { playlistId, userId, note }: AddItemParams) {
    try {
        const [playlist, existingItem] = await Promise.all([
            prisma.playlist.findFirst({
                where: {
                    id: playlistId,
                    OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
                },
            }),
            prisma.playlistEpisode.findUnique({
                where: {
                    playlistId_episodeId: {
                        playlistId,
                        episodeId,
                    },
                },
            }),
        ]);

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        if (existingItem) {
            throw new Error("Episode already exists in playlist");
        }

        await prisma.$transaction([
            prisma.playlistEpisode.create({
                data: {
                    playlistId,
                    episodeId,
                    userId,
                    note,
                    orderIndex: await prisma.playlistEpisode.count({ where: { playlistId } }),
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { increment: 1 } },
            }),
            prisma.playlistActivityEpisode.create({
                data: {
                    playlistId,
                    episodeId,
                    userId,
                    actionType: "ItemAdded",
                    metadata: { note },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to add episode to playlist");
    }
}

export async function removeEpisodeFromPlaylist(episodeId: number, playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        await prisma.$transaction([
            prisma.playlistEpisode.delete({
                where: {
                    playlistId_episodeId: {
                        playlistId,
                        episodeId,
                    },
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { decrement: 1 } },
            }),
            prisma.playlistActivityEpisode.create({
                data: {
                    playlistId,
                    episodeId,
                    userId,
                    actionType: "ItemRemoved",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to remove episode from playlist");
    }
}
// #endregion

// #region "Actor Items"
export async function addActorToPlaylist(actorId: number, { playlistId, userId, note }: AddItemParams) {
    try {
        const [playlist, existingItem] = await Promise.all([
            prisma.playlist.findFirst({
                where: {
                    id: playlistId,
                    OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
                },
            }),
            prisma.playlistActor.findUnique({
                where: {
                    playlistId_actorId: {
                        playlistId,
                        actorId,
                    },
                },
            }),
        ]);

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        if (existingItem) {
            throw new Error("Actor already exists in playlist");
        }

        await prisma.$transaction([
            prisma.playlistActor.create({
                data: {
                    playlistId,
                    actorId,
                    userId,
                    note,
                    orderIndex: await prisma.playlistActor.count({ where: { playlistId } }),
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { increment: 1 } },
            }),
            prisma.playlistActivityActor.create({
                data: {
                    playlistId,
                    actorId,
                    userId,
                    actionType: "ItemAdded",
                    metadata: { note },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to add actor to playlist");
    }
}

export async function removeActorFromPlaylist(actorId: number, playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        await prisma.$transaction([
            prisma.playlistActor.delete({
                where: {
                    playlistId_actorId: {
                        playlistId,
                        actorId,
                    },
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { decrement: 1 } },
            }),
            prisma.playlistActivityActor.create({
                data: {
                    playlistId,
                    actorId,
                    userId,
                    actionType: "ItemRemoved",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to remove actor from playlist");
    }
}
// #endregion

// #region "Crew Items"
export async function addCrewToPlaylist(crewId: number, { playlistId, userId, note }: AddItemParams) {
    try {
        const [playlist, existingItem] = await Promise.all([
            prisma.playlist.findFirst({
                where: {
                    id: playlistId,
                    OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
                },
            }),
            prisma.playlistCrew.findUnique({
                where: {
                    playlistId_crewId: {
                        playlistId,
                        crewId,
                    },
                },
            }),
        ]);

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        if (existingItem) {
            throw new Error("Crew member already exists in playlist");
        }

        await prisma.$transaction([
            prisma.playlistCrew.create({
                data: {
                    playlistId,
                    crewId,
                    userId,
                    note,
                    orderIndex: await prisma.playlistCrew.count({ where: { playlistId } }),
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { increment: 1 } },
            }),
            prisma.playlistActivityCrew.create({
                data: {
                    playlistId,
                    crewId,
                    userId,
                    actionType: "ItemAdded",
                    metadata: { note },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to add crew member to playlist");
    }
}

export async function removeCrewFromPlaylist(crewId: number, playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId, canEdit: true } } }],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        await prisma.$transaction([
            prisma.playlistCrew.delete({
                where: {
                    playlistId_crewId: {
                        playlistId,
                        crewId,
                    },
                },
            }),
            prisma.playlist.update({
                where: { id: playlistId },
                data: { itemCount: { decrement: 1 } },
            }),
            prisma.playlistActivityCrew.create({
                data: {
                    playlistId,
                    crewId,
                    userId,
                    actionType: "ItemRemoved",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to remove crew member from playlist");
    }
}
// #endregion
