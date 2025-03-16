"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

export async function shareList(listId: number, userId: number, targetUserId: number, canEdit: boolean = false) {
    try {
        // Check if list exists and user is the owner
        const list = await prisma.list.findFirst({
            where: {
                id: listId,
                userId, // Only owner can share
            },
        });

        if (!list) {
            throw new Error("List not found or you don't have permission to share");
        }

        // Check if share already exists
        const existingShare = await prisma.listShare.findUnique({
            where: {
                listId_userId: {
                    listId,
                    userId: targetUserId,
                },
            },
        });

        if (existingShare) {
            throw new Error("List is already shared with this user");
        }

        // Create share and update stats in a transaction
        await prisma.$transaction([
            prisma.listShare.create({
                data: {
                    listId,
                    userId: targetUserId,
                    canEdit,
                },
            }),
            // Update user stats
            prisma.userListStats.upsert({
                where: { userId },
                create: {
                    userId,
                    sharedLists: 1,
                    totalLists: 1,
                },
                update: {
                    sharedLists: { increment: 1 },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to share list");
    }
}

export async function unshareList(listId: number, userId: number, targetUserId: number) {
    try {
        // Check if list exists and user is the owner
        const list = await prisma.list.findFirst({
            where: {
                id: listId,
                userId, // Only owner can unshare
            },
        });

        if (!list) {
            throw new Error("List not found or you don't have permission to unshare");
        }

        // Check if share exists
        const existingShare = await prisma.listShare.findUnique({
            where: {
                listId_userId: {
                    listId,
                    userId: targetUserId,
                },
            },
        });

        if (!existingShare) {
            throw new Error("List is not shared with this user");
        }

        // Remove share and update stats in a transaction
        await prisma.$transaction([
            prisma.listShare.delete({
                where: {
                    listId_userId: {
                        listId,
                        userId: targetUserId,
                    },
                },
            }),
            // Update user stats
            prisma.userListStats.update({
                where: { userId },
                data: {
                    sharedLists: { decrement: 1 },
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to unshare list");
    }
}
