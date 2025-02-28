"use server";

import { Playlist, PlaylistType, Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";

interface PlaylistParams {
    page?: number;
    perPage?: number;
    sortBy?: string;
    ascOrDesc?: string;
    type?: PlaylistType;
    isPrivate?: boolean;
    isArchived?: boolean;
}

// #region "GET Methods"
export async function getPlaylists(userId: number, params: PlaylistParams = {}) {
    const {
        page = 1,
        perPage = 12,
        sortBy = "createdAt",
        ascOrDesc = "desc",
        type,
        isPrivate,
        isArchived,
    } = params;

    const skip = (page - 1) * perPage;
    const where: Prisma.PlaylistWhereInput = {
        userId,
        ...(type && { type }),
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

        return { items: playlists, total };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch playlists");
    }
}

export async function getPlaylistById(playlistId: number, userId: number) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                OR: [
                    { userId },
                    { sharedWith: { some: { userId } } },
                ],
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

// #region "Mutation Methods"
export async function createPlaylist(data: {
    name: string;
    description?: string;
    type: PlaylistType;
    isPrivate: boolean;
    userId: number;
}): Promise<Playlist> {
    try {
        const playlist = await prisma.playlist.create({
            data: {
                ...data,
                itemCount: 0,
            },
        });

        revalidatePath("/playlists");
        return playlist;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to create playlist");
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
                OR: [
                    { userId },
                    { sharedWith: { some: { userId, canEdit: true } } },
                ],
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to edit");
        }

        const updatedPlaylist = await prisma.playlist.update({
            where: { id: playlistId },
            data,
        });

        revalidatePath("/playlists");
        return updatedPlaylist;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update playlist");
    }
}

export async function deletePlaylist(playlistId: number, userId: number): Promise<void> {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                userId, // Only owner can delete
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to delete");
        }

        await prisma.playlist.delete({
            where: { id: playlistId },
        });

        revalidatePath("/playlists");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to delete playlist");
    }
}