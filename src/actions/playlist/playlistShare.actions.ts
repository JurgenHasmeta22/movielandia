"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

export async function sharePlaylist(
    playlistId: number,
    userId: number,
    targetUserId: number,
    canEdit: boolean = false,
) {
    try {
        // Check if playlist exists and user is the owner
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                userId, // Only owner can share
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to share");
        }

        // Check if share already exists
        const existingShare = await prisma.playlistShare.findUnique({
            where: {
                playlistId_userId: {
                    playlistId,
                    userId: targetUserId,
                },
            },
        });

        if (existingShare) {
            throw new Error("Playlist is already shared with this user");
        }

        // Create share and update stats in a transaction
        await prisma.$transaction([
            prisma.playlistShare.create({
                data: {
                    playlistId,
                    userId: targetUserId,
                    canEdit,
                },
            }),
            // Update user stats
            prisma.userPlaylistStats.upsert({
                where: { userId },
                create: {
                    userId,
                    sharedPlaylists: 1,
                    totalPlaylists: 1,
                },
                update: {
                    sharedPlaylists: { increment: 1 },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to share playlist");
    }
}

export async function unsharePlaylist(playlistId: number, userId: number, targetUserId: number) {
    try {
        // Check if playlist exists and user is the owner
        const playlist = await prisma.playlist.findFirst({
            where: {
                id: playlistId,
                userId, // Only owner can unshare
            },
        });

        if (!playlist) {
            throw new Error("Playlist not found or you don't have permission to unshare");
        }

        // Check if share exists
        const existingShare = await prisma.playlistShare.findUnique({
            where: {
                playlistId_userId: {
                    playlistId,
                    userId: targetUserId,
                },
            },
        });

        if (!existingShare) {
            throw new Error("Playlist is not shared with this user");
        }

        // Remove share and update stats in a transaction
        await prisma.$transaction([
            prisma.playlistShare.delete({
                where: {
                    playlistId_userId: {
                        playlistId,
                        userId: targetUserId,
                    },
                },
            }),
            // Update user stats
            prisma.userPlaylistStats.update({
                where: { userId },
                data: {
                    sharedPlaylists: { decrement: 1 },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to unshare playlist");
    }
}
