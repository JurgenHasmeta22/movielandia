"use server";

import { prisma } from "../../../prisma/config/prisma";

export async function getUserForumTopics(
	userId: number,
	page: number = 1,
	search: string = "",
	sortBy: string = "createdAt",
	sortOrder: "asc" | "desc" = "asc",
) {
	const perPage = 10;
	const skip = (page - 1) * perPage;

	const orderBy: any = {};
	orderBy[sortBy] = sortOrder;

	try {
		const [topics, total] = await Promise.all([
			prisma.forumTopic.findMany({
				where: {
					userId,
					title: {
						contains: search,
						mode: "insensitive",
					},
				},
				include: {
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
							upvotes: true,
						},
					},
				},
				orderBy,
				skip,
				take: perPage,
			}),
			prisma.forumTopic.count({
				where: {
					userId,
					title: {
						contains: search,
						mode: "insensitive",
					},
				},
			}),
		]);

		return {
			items: topics || [],
			total: total || 0,
		};
	} catch (error) {
		console.error("Error fetching user forum topics:", error);
		return {
			items: [],
			total: 0,
		};
	}
}

export async function getUserForumReplies(
	userId: number,
	page: number = 1,
	search: string = "",
	sortBy: string = "createdAt",
	sortOrder: "asc" | "desc" = "asc",
) {
	const perPage = 10;
	const skip = (page - 1) * perPage;

	const orderBy: any = {};
	orderBy[sortBy] = sortOrder;

	try {
		const [replies, total] = await Promise.all([
			prisma.forumReply.findMany({
				where: {
					userId,
					content: {
						contains: search,
						mode: "insensitive",
					},
				},
				include: {
					post: {
						select: {
							id: true,
							content: true,
							topic: {
								select: {
									id: true,
									title: true,
									slug: true,
									categoryId: true,
									category: {
										select: {
											id: true,
											name: true,
											slug: true,
										},
									},
								},
							},
						},
					},
					_count: {
						select: {
							upvotes: true,
						},
					},
				},
				orderBy,
				skip,
				take: perPage,
			}),
			prisma.forumReply.count({
				where: {
					userId,
					content: {
						contains: search,
						mode: "insensitive",
					},
				},
			}),
		]);

		return {
			items: replies || [],
			total: total || 0,
		};
	} catch (error) {
		console.error("Error fetching user forum replies:", error);

		return {
			items: [],
			total: 0,
		};
	}
}
