"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";
import { PostType } from "@prisma/client";

export async function createPost(
	content: string,
	topicId: number,
	userId: number,
	type: PostType = "Normal",
): Promise<void> {
	try {
		const result = await prisma.forumPost.create({
			data: {
				content,
				topicId,
				userId,
				type,
				slug: `post-${Date.now()}`,
			},
		});

		if (result) {
			await prisma.forumTopic.update({
				where: { id: topicId },
				data: { lastPostAt: new Date() },
			});

			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
		} else {
			throw new Error("Failed to create post.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function updatePost(
	postId: number,
	content: string,
	userId: number,
): Promise<void> {
	try {
		const post = await prisma.forumPost.findFirst({
			where: {
				id: postId,
				userId,
			},
		});

		if (!post) {
			throw new Error(
				"Post not found or you don't have permission to edit.",
			);
		}

		const result = await prisma.forumPost.update({
			where: { id: postId },
			data: {
				content,
				isEdited: true,
			},
		});

		if (result) {
			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
		} else {
			throw new Error("Failed to update post.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function deletePost(
	postId: number,
	userId: number,
): Promise<void> {
	try {
		const post = await prisma.forumPost.findFirst({
			where: {
				id: postId,
				userId,
			},
		});

		if (!post) {
			throw new Error(
				"Post not found or you don't have permission to delete.",
			);
		}

		const result = await prisma.forumPost.update({
			where: { id: postId },
			data: {
				isDeleted: true,
				deletedAt: new Date(),
				deletedById: userId,
			},
		});

		if (result) {
			const referer = getReferer();
			revalidatePath(`${referer}`, "page");
		} else {
			throw new Error("Failed to delete post.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function getPostsByTopicId(
	topicId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	const [posts, total] = await Promise.all([
		prisma.forumPost.findMany({
			where: {
				topicId,
				isDeleted: false,
			},
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
						slug: true,
						categoryId: true,
						category: {
							select: {
								id: true,
								slug: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: "asc",
			},
			skip,
			take: limit,
		}),
		prisma.forumPost.count({
			where: {
				topicId,
				isDeleted: false,
			},
		}),
	]);

	return {
		items: posts || [],
		total: total || 0,
	};
}

export async function markPostAsAnswer(
	postId: number,
	userId: number,
): Promise<void> {
	try {
		const post = await prisma.forumPost.findUnique({
			where: { id: postId },
			include: { topic: true },
		});

		if (!post) {
			throw new Error("Post not found.");
		}

		if (post.topic.userId !== userId) {
			throw new Error(
				"Only the topic creator can mark a post as answer.",
			);
		}

		const result = await prisma.forumPost.update({
			where: { id: postId },
			data: {
				isAnswer: true,
				answeredAt: new Date(),
				answeredById: userId,
				type: "Answered",
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

export async function getPostById(postId: number) {
	try {
		const post = await prisma.forumPost.findUnique({
			where: { id: postId },
			include: {
				topic: {
					select: {
						id: true,
						title: true,
						slug: true,
						isLocked: true,
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
				user: {
					select: {
						id: true,
						userName: true,
						avatar: true,
					},
				},
			},
		});

		return post;
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}
