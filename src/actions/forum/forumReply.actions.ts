"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

export async function createReply(content: string, postId: number, userId: number): Promise<void> {
    try {
        const result = await prisma.forumReply.create({
            data: {
                content,
                postId,
                userId,
                isEdited: false,
                isModerated: false,
            },
        });

        if (!result) {
            throw new Error("Failed to create reply.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function updateReply(replyId: number, content: string, userId: number): Promise<void> {
    try {
        const reply = await prisma.forumReply.findFirst({
            where: {
                id: replyId,
                userId,
            },
        });

        if (!reply) {
            throw new Error("Reply not found or you don't have permission to edit.");
        }

        const result = await prisma.forumReply.update({
            where: { id: replyId },
            data: {
                content,
                isEdited: true,
            },
        });

        if (!result) {
            throw new Error("Failed to update reply.");
        }

        await prisma.forumReplyHistory.create({
            data: {
                replyId,
                content: reply.content,
                editedAt: new Date(),
                editedById: userId,
            },
        });

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function deleteReply(replyId: number, userId: number): Promise<void> {
    try {
        const reply = await prisma.forumReply.findFirst({
            where: {
                id: replyId,
                userId,
            },
        });

        if (!reply) {
            throw new Error("Reply not found or you don't have permission to delete.");
        }

        const result = await prisma.forumReply.delete({
            where: { id: replyId },
        });

        if (!result) {
            throw new Error("Failed to delete reply.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getRepliesByPostId(postId: number, page: number = 1, limit: number = 10, userId?: number) {
    const skip = (page - 1) * limit;

    const [replies, total] = await Promise.all([
        prisma.forumReply.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        avatar: true,
                    },
                },
                upvotes: userId ? {
                    where: {
                        userId: userId
                    },
                    select: {
                        userId: true
                    }
                } : false,
                _count: {
                    select: {
                        upvotes: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
            skip,
            take: limit,
        }),
        prisma.forumReply.count({
            where: { postId },
        }),
    ]);

    return {
        items: replies || [],
        total: total || 0,
    };
}

export async function upvoteReply(replyId: number, userId: number): Promise<void> {
    try {
        const existingUpvote = await prisma.upvoteForumReply.findFirst({
            where: {
                userId,
                replyId,
            },
        });

        if (existingUpvote) {
            await prisma.upvoteForumReply.delete({
                where: {
                    id: existingUpvote.id,
                },
            });
        } else {
            await prisma.upvoteForumReply.create({
                data: {
                    userId,
                    replyId,
                },
            });
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
