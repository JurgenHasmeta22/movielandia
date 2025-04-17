"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";
import { NotificationType } from "@prisma/client";

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

        // Get list details for notification
        const listDetails = await prisma.list.findUnique({
            where: { id: listId },
            select: { name: true },
        });

        // Create share and notification separately to avoid transaction issues
        // First, create the share
        await prisma.listShare.create({
            data: {
                listId,
                userId: targetUserId,
                canEdit,
            },
        });

        // Then, update user stats
        await prisma.userListStats.upsert({
            where: { userId },
            create: {
                userId,
                sharedLists: 1,
                totalLists: 1,
            },
            update: {
                sharedLists: { increment: 1 },
            },
        });

        // Finally, create notification
        await prisma.notification.create({
            data: {
                type: NotificationType.list_shared,
                content: `shared their list "${listDetails?.name}" with you`,
                userId: targetUserId,
                senderId: userId,
                status: "unread",
            },
        });

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

        // Get list details for notification
        const listDetails = await prisma.list.findUnique({
            where: { id: listId },
            select: { name: true },
        });

        // Remove share and create notification separately to avoid transaction issues
        // First, delete the share
        await prisma.listShare.delete({
            where: {
                listId_userId: {
                    listId,
                    userId: targetUserId,
                },
            },
        });

        // Then, update user stats
        await prisma.userListStats.update({
            where: { userId },
            data: {
                sharedLists: { decrement: 1 },
            },
        });

        // Finally, create notification
        await prisma.notification.create({
            data: {
                type: NotificationType.list_shared,
                content: `removed you from their list "${listDetails?.name}"`,
                userId: targetUserId,
                senderId: userId,
                status: "unread",
            },
        });

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to unshare list");
    }
}

export async function updateSharePermission(listId: number, userId: number, targetUserId: number, canEdit: boolean) {
    try {
        // Check if list exists and user is the owner
        const list = await prisma.list.findFirst({
            where: {
                id: listId,
                userId, // Only owner can update permissions
            },
        });

        if (!list) {
            throw new Error("List not found or you don't have permission to update sharing settings");
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

        // Get list details for notification
        const listDetails = await prisma.list.findUnique({
            where: { id: listId },
            select: { name: true },
        });

        // Update share permissions and create notification separately to avoid transaction issues
        // First, update the share permissions
        await prisma.listShare.update({
            where: {
                listId_userId: {
                    listId,
                    userId: targetUserId,
                },
            },
            data: {
                canEdit,
            },
        });

        // Then, create notification
        await prisma.notification.create({
            data: {
                type: NotificationType.list_permission_updated,
                content: `updated your permissions for list "${listDetails?.name}" to ${canEdit ? "edit" : "view only"}`,
                userId: targetUserId,
                senderId: userId,
                status: "unread",
            },
        });

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update sharing permissions");
    }
}
