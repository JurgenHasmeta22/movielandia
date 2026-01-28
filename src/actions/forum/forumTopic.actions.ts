"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";
import { TopicStatus } from "../../../prisma/generated/prisma/enums";

interface TopicsParams {
	categoryId?: number;
	page?: number;
	limit?: number;
	tagIds?: number[];
	status?: TopicStatus;
	topicsSortBy?: string;
	topicsAscOrDesc?: string;
}

export async function createTopic(
	title: string,
	content: string,
	categoryId: number,
	userId: number,
	tagIds?: number[],
): Promise<any> {
	try {
		const result = await prisma.forumTopic.create({
			data: {
				title,
				content,
				categoryId,
				userId,
				slug: title.toLowerCase().replace(/\s+/g, "-"),
				tags:
					tagIds && tagIds.length > 0
						? {
								connect: tagIds.map((id) => ({ id })),
							}
						: undefined,
			},
		});

		if (result) {
			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
			return result;
		} else {
			throw new Error("Failed to create topic.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function updateTopic(
	topicId: number,
	title: string,
	content: string,
	userId: number,
	tagIds?: number[],
): Promise<any> {
	try {
		const topic = await prisma.forumTopic.findFirst({
			where: {
				id: topicId,
				userId,
			},
		});

		if (!topic) {
			throw new Error(
				"Topic not found or you don't have permission to edit.",
			);
		}

		const result = await prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				title,
				content,
				slug: title.toLowerCase().replace(/\s+/g, "-"),
				tags: tagIds
					? {
							set: [],
							connect: tagIds.map((id) => ({ id })),
						}
					: undefined,
			},
		});

		if (result) {
			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
			return result;
		} else {
			throw new Error("Failed to update topic.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function deleteTopic(
	topicId: number,
	userId: number,
): Promise<void> {
	try {
		const topic = await prisma.forumTopic.findFirst({
			where: {
				id: topicId,
				userId,
			},
		});

		if (!topic) {
			throw new Error(
				"Topic not found or you don't have permission to delete.",
			);
		}

		await prisma.forumPost.deleteMany({
			where: { topicId },
		});

		const result = await prisma.forumTopic.delete({
			where: { id: topicId },
		});

		if (!result) {
			throw new Error("Failed to delete topic.");
		}

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function getTopics(params: TopicsParams) {
	const {
		categoryId,
		page = 1,
		limit = 10,
		tagIds,
		status,
		topicsSortBy = "lastPostAt",
		topicsAscOrDesc = "asc",
	} = params;

	console.log("getTopics called with params:", {
		categoryId,
		page,
		limit,
		tagIds,
		status,
		topicsSortBy,
		topicsAscOrDesc,
	});

	const orderByObject: any = {};
	const finalSortBy = topicsSortBy;
	const finalOrder = topicsAscOrDesc;
	orderByObject[finalSortBy] = finalOrder;

	const skip = (page - 1) * limit;
	let whereClause: any = {};

	if (categoryId) {
		whereClause.categoryId = categoryId;
	}

	if (tagIds && tagIds.length > 0) {
		whereClause.tags = {
			some: {
				id: { in: tagIds },
			},
		};
	}

	if (status) {
		let statusValue: TopicStatus;

		if (typeof status === "string") {
			if (status === "Open") statusValue = TopicStatus.Open;
			else if (status === "Closed") statusValue = TopicStatus.Closed;
			else if (status === "Archived") statusValue = TopicStatus.Archived;
			else {
				console.error(`Invalid status string: ${status}`);
				statusValue = TopicStatus.Open;
			}
		} else {
			statusValue = status;
		}

		whereClause.status = statusValue;
		console.log(`Filtering by status: ${statusValue}`);
	}

	const [topics, total] = await Promise.all([
		prisma.forumTopic.findMany({
			where: whereClause,
			include: {
				user: {
					select: {
						id: true,
						userName: true,
						avatar: true,
					},
				},
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
				tags: true,
				_count: {
					select: {
						posts: true,
					},
				},
			},
			orderBy: orderByObject,
			skip,
			take: limit,
		}),
		prisma.forumTopic.count({
			where: whereClause,
		}),
	]);

	return {
		items: topics || [],
		total: total || 0,
	};
}

export async function getTopicById(
	topicId: number,
	includeViews: boolean = false,
) {
	if (includeViews) {
		await prisma.forumTopic.update({
			where: { id: topicId },
			data: { viewCount: { increment: 1 } },
		});
	}

	const topic = await prisma.forumTopic.findUnique({
		where: { id: topicId },
		include: {
			user: {
				select: {
					id: true,
					userName: true,
					avatar: true,
				},
			},
			category: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
			tags: true,
		},
	});

	if (!topic) {
		throw new Error("Topic not found.");
	}

	return topic;
}

export async function toggleTopicPin(
	topicId: number,
	_userId: number,
): Promise<void> {
	try {
		const topic = await prisma.forumTopic.findUnique({
			where: { id: topicId },
		});

		if (!topic) {
			throw new Error("Topic not found.");
		}

		const result = await prisma.forumTopic.update({
			where: { id: topicId },
			data: { isPinned: !topic.isPinned },
		});

		if (result) {
			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function toggleTopicLock(
	topicId: number,
	userId: number,
): Promise<void> {
	try {
		const topic = await prisma.forumTopic.findUnique({
			where: { id: topicId },
		});

		if (!topic) {
			throw new Error("Topic not found.");
		}

		const result = await prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				isLocked: !topic.isLocked,
				closedAt: !topic.isLocked ? new Date() : null,
				closedById: !topic.isLocked ? userId : null,
			},
		});

		if (result) {
			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}
