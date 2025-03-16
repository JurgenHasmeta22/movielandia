"use server";

import { Playlist, Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/config/prisma";
import { redirect } from "next/navigation";
import { getReferer } from "../user/user.actions";
import type { PlaylistFormData } from "@/schemas/playlist.schema";
import { slugify } from "@/utils/helpers/string";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface PlaylistParams {
    page?: number;
    perPage?: number;
    sortBy?: string;
    ascOrDesc?: string;
    isPrivate?: boolean;
    isArchived?: boolean;
}

export async function getUserPlaylists(userId: number, params: PlaylistParams = {}) {
    const { page = 1, perPage = 12, sortBy = "createdAt", ascOrDesc = "desc", isPrivate, isArchived } = params;

    const skip = (page - 1) * perPage;
    const where: Prisma.PlaylistWhereInput = {
        userId,
        ...(typeof isPrivate === "boolean" && { isPrivate }),
        ...(typeof isArchived === "boolean" && { isArchived }),
    };

    try {
        const [playlists, total] = await prisma.$transaction([
            prisma.playlist.findMany({
                where,
                orderBy: { [sortBy]: ascOrDesc },
                skip,
                take: perPage,
                include: {
                    _count: {
                        select: {
                            movieItems: true,
                            serieItems: true,
                            seasonItems: true,
                            episodeItems: true,
                            actorItems: true,
                            crewItems: true,
                        },
                    },
                    sharedWith: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    userName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.playlist.count({ where }),
        ]);

        return {
            items: playlists,
            total,
            success: true,
        };
    } catch (error) {
        console.error("Failed to fetch user playlists:", error);

        return {
            items: [],
            total: 0,
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch user playlists",
        };
    }
}

export async function getPlaylistById(playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [{ userId }, { sharedWith: { some: { userId } } }],
            },
            include: {
                movieItems: {
                    include: { movie: true },
                    orderBy: { orderIndex: "asc" },
                },
                serieItems: {
                    include: { serie: true },
                    orderBy: { orderIndex: "asc" },
                },
                seasonItems: {
                    include: { season: true },
                    orderBy: { orderIndex: "asc" },
                },
                episodeItems: {
                    include: { episode: true },
                    orderBy: { orderIndex: "asc" },
                },
                actorItems: {
                    include: { actor: true },
                    orderBy: { orderIndex: "asc" },
                },
                crewItems: {
                    include: { crew: true },
                    orderBy: { orderIndex: "asc" },
                },
                sharedWith: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found");
        }

        return playlist;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist");
    }
}

export async function getPlaylistMovies(playlistId: number, userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
        const [movies, total] = await prisma.$transaction([
            prisma.playlistMovie.findMany({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
                include: {
                    movie: {
                        select: {
                            id: true,
                            title: true,
                            photoSrc: true,
                            photoSrcProd: true,
                            ratingImdb: true,
                            dateAired: true,
                            duration: true,
                        },
                    },
                },
                orderBy: { orderIndex: "asc" },
                skip,
                take: limit,
            }),
            prisma.playlistMovie.count({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
            }),
        ]);

        return { items: movies, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist movies");
    }
}

export async function getPlaylistSeries(playlistId: number, userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
        const [series, total] = await prisma.$transaction([
            prisma.playlistSerie.findMany({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
                include: {
                    serie: {
                        select: {
                            id: true,
                            title: true,
                            photoSrc: true,
                            photoSrcProd: true,
                            ratingImdb: true,
                            dateAired: true,
                        },
                    },
                },
                orderBy: { orderIndex: "asc" },
                skip,
                take: limit,
            }),
            prisma.playlistSerie.count({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
            }),
        ]);

        return { items: series, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist series");
    }
}

export async function getPlaylistActors(playlistId: number, userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
        const [actors, total] = await prisma.$transaction([
            prisma.playlistActor.findMany({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
                include: {
                    actor: {
                        select: {
                            id: true,
                            fullname: true,
                            photoSrc: true,
                            photoSrcProd: true,
                            debut: true,
                        },
                    },
                },
                orderBy: { orderIndex: "asc" },
                skip,
                take: limit,
            }),
            prisma.playlistActor.count({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
            }),
        ]);

        return { items: actors, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist actors");
    }
}

export async function getPlaylistCrew(playlistId: number, userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
        const [crew, total] = await prisma.$transaction([
            prisma.playlistCrew.findMany({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
                include: {
                    crew: {
                        select: {
                            id: true,
                            fullname: true,
                            photoSrc: true,
                            photoSrcProd: true,
                            debut: true,
                        },
                    },
                },
                orderBy: { orderIndex: "asc" },
                skip,
                take: limit,
            }),
            prisma.playlistCrew.count({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
            }),
        ]);

        return { items: crew, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist crew");
    }
}

export async function getPlaylistSeasons(playlistId: number, userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
        const [seasons, total] = await prisma.$transaction([
            prisma.playlistSeason.findMany({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
                include: {
                    season: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            photoSrc: true,
                            photoSrcProd: true,
                            trailerSrc: true,
                            dateAired: true,
                            ratingImdb: true,
                            serie: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { orderIndex: "asc" },
                skip,
                take: limit,
            }),
            prisma.playlistSeason.count({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
            }),
        ]);

        return { items: seasons, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist seasons");
    }
}

export async function getPlaylistEpisodes(playlistId: number, userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    try {
        const [episodes, total] = await prisma.$transaction([
            prisma.playlistEpisode.findMany({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
                include: {
                    episode: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            photoSrc: true,
                            photoSrcProd: true,
                            trailerSrc: true,
                            dateAired: true,
                            ratingImdb: true,
                            season: {
                                select: {
                                    id: true,
                                    title: true,
                                    serie: {
                                        select: {
                                            id: true,
                                            title: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { orderIndex: "asc" },
                skip,
                take: limit,
            }),
            prisma.playlistEpisode.count({
                where: {
                    playlistId,
                    playlist: {
                        OR: [{ userId }, { sharedWith: { some: { userId } } }],
                    },
                },
            }),
        ]);

        return { items: episodes, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlist episodes");
    }
}
// #endregion

// #region "Mutation Methods"
export async function createPlaylist(data: PlaylistFormData & { userId: number }) {
    try {
        const playlist = await prisma.playlist.create({
            data: {
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate,
                userId: data.userId,
            },
        });

        if (!playlist) {
            throw new Error("Failed to create playlist");
        }

        const playlistSlug = slugify(playlist.name);
        const currentPath = await getReferer();
        const path = currentPath.replace('/create', `/${playlist.id}/${playlistSlug}/add-items`);
        redirect(path);
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        } else {
            console.log('Other error')
        }
    }
}

export async function updatePlaylist(
    playlistId: number,
    userId: number,
    data: {
        name?: string;
        description?: string;
        isPrivate?: boolean;
        isArchived?: boolean;
    },
): Promise<Playlist> {
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

        await prisma.playlist.update({
            where: { id: playlistId },
            data,
        });

        const path = `/users/${userId}/${await getReferer()}/lists`;
        redirect(path);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update playlist");
    }
}

export async function deletePlaylist(playlistId: number, userId: number): Promise<void> {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                userId,
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to delete");
        }

        await prisma.playlist.delete({
            where: { id: playlistId },
        });

        const path = `/users/${userId}/${await getReferer()}/lists`;
        redirect(path);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to delete playlist");
    }
}

export async function getPlaylistForAddItems(playlistId: number) {
    try {
        const playlist = await prisma.playlist.findUnique({
            where: { id: playlistId },
            include: {
                movieItems: { select: { id: true } },
                serieItems: { select: { id: true } },
                seasonItems: { select: { id: true } },
                episodeItems: { select: { id: true } },
                actorItems: { select: { id: true } },
                crewItems: { select: { id: true } },
            }
        });

        if (!playlist) {
            return null;
        }

        // Determine existing type
        const existingType =
            playlist.movieItems.length > 0 ? "Movie" :
                playlist.serieItems.length > 0 ? "Serie" :
                    playlist.seasonItems.length > 0 ? "Season" :
                        playlist.episodeItems.length > 0 ? "Episode" :
                            playlist.actorItems.length > 0 ? "Actor" :
                                playlist.crewItems.length > 0 ? "Crew" :
                                    null;

        return { playlist, existingType };
    } catch (error: any) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
// #endregion
