"use server";

import { prisma } from "../../../prisma/config/prisma";
import { TopicStatus } from "../../../prisma/generated/prisma/enums";

export type ForumSearchResult = {
	topics: {
		items: any[];
		total: number;
	};
	posts: {
		items: any[];
		total: number;
	};
	replies: {
		items: any[];
		total: number;
	};
};

export async function searchForumContent(
	query: string,
	page: number = 1,
	limit: number = 10,
	filters: {
		categoryId?: number;
		userId?: number;
		tagIds?: number[];
		status?: TopicStatus;
		dateFrom?: Date;
		dateTo?: Date;
	} = {},
): Promise<ForumSearchResult> {
	const skip = (page - 1) * limit;

	// Base where clause for topics
	let topicWhereClause: any = {
		OR: [
			{ title: { contains: query, mode: "insensitive" } },
			{ content: { contains: query, mode: "insensitive" } },
		],
	};

	// Base where clause for posts
	let postWhereClause: any = {
		content: { contains: query, mode: "insensitive" },
	};

	// Base where clause for replies
	let replyWhereClause: any = {
		content: { contains: query, mode: "insensitive" },
	};

	// Apply category filter if provided
	if (filters.categoryId) {
		topicWhereClause.categoryId = filters.categoryId;
		postWhereClause.topic = { categoryId: filters.categoryId };
		replyWhereClause.post = { topic: { categoryId: filters.categoryId } };
	}

	// Apply user filter if provided
	if (filters.userId) {
		topicWhereClause.userId = filters.userId;
		postWhereClause.userId = filters.userId;
		replyWhereClause.userId = filters.userId;
	}

	// Apply tag filter if provided
	if (filters.tagIds && filters.tagIds.length > 0) {
		topicWhereClause.tags = {
			some: {
				id: { in: filters.tagIds },
			},
		};
	}

	// Apply status filter if provided
	if (filters.status) {
		topicWhereClause.status = filters.status;
	}

	// Apply date range filter if provided
	if (filters.dateFrom || filters.dateTo) {
		const dateFilter: any = {};

		if (filters.dateFrom) {
			dateFilter.gte = filters.dateFrom;
		}

		if (filters.dateTo) {
			dateFilter.lte = filters.dateTo;
		}

		topicWhereClause.createdAt = dateFilter;
		postWhereClause.createdAt = dateFilter;
		replyWhereClause.createdAt = dateFilter;
	}

	// Execute all queries in parallel
	const [topics, topicsCount, posts, postsCount, replies, repliesCount] =
		await Promise.all([
			// Topics query
			prisma.forumTopic.findMany({
				where: topicWhereClause,
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
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.forumTopic.count({ where: topicWhereClause }),

			// Posts query
			prisma.forumPost.findMany({
				where: postWhereClause,
				include: {
					user: {
						select: {
							id: true,
							userName: true,
							avatar: true,
						},
					},
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
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.forumPost.count({ where: postWhereClause }),

			// Replies query
			prisma.forumReply.findMany({
				where: replyWhereClause,
				include: {
					user: {
						select: {
							id: true,
							userName: true,
							avatar: true,
						},
					},
					post: {
						select: {
							id: true,
							slug: true,
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
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.forumReply.count({ where: replyWhereClause }),
		]);

	return {
		topics: {
			items: topics,
			total: topicsCount,
		},
		posts: {
			items: posts,
			total: postsCount,
		},
		replies: {
			items: replies,
			total: repliesCount,
		},
	};
}
