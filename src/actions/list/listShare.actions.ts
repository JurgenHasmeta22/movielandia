"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";
import { NotificationType } from "../../../prisma/generated/prisma/enums";

export async function shareList(
	listId: number,
	userId: number,
	targetUserId: number,
	canEdit: boolean = false,
) {
	try {
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				userId,
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to share",
			);
		}

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

		const listDetails = await prisma.list.findUnique({
			where: { id: listId },
			select: { name: true },
		});

		await prisma.listShare.create({
			data: {
				listId,
				userId: targetUserId,
				canEdit,
			},
		});

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
		throw new Error(
			error instanceof Error ? error.message : "Failed to share list",
		);
	}
}

export async function unshareList(
	listId: number,
	userId: number,
	targetUserId: number,
) {
	try {
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				userId,
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to unshare",
			);
		}

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

		const listDetails = await prisma.list.findUnique({
			where: { id: listId },
			select: { name: true },
		});

		await prisma.listShare.delete({
			where: {
				listId_userId: {
					listId,
					userId: targetUserId,
				},
			},
		});

		await prisma.userListStats.update({
			where: { userId },
			data: {
				sharedLists: { decrement: 1 },
			},
		});

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
		throw new Error(
			error instanceof Error ? error.message : "Failed to unshare list",
		);
	}
}

export async function updateSharePermission(
	listId: number,
	userId: number,
	targetUserId: number,
	canEdit: boolean,
) {
	try {
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				userId,
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to update sharing settings",
			);
		}

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

		const listDetails = await prisma.list.findUnique({
			where: { id: listId },
			select: { name: true },
		});

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
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to update sharing permissions",
		);
	}
}
