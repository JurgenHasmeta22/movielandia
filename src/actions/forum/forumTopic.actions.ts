"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

export async function createTopic(title: string, content: string, categoryId: number, userId: number): Promise<void> {
    try {
        const result = await prisma.forumTopic.create({
            data: {
                title,
                content,
                categoryId,
                userId,
                slug: title.toLowerCase().replace(/\s+/g, "-"),
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to create topic.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function updateTopic(topicId: number, title: string, content: string, userId: number): Promise<void> {
    try {
        const topic = await prisma.forumTopic.findFirst({
            where: {
                id: topicId,
                userId,
            },
        });

        if (!topic) {
            throw new Error("Topic not found or you don't have permission to edit.");
        }

        const result = await prisma.forumTopic.update({
            where: { id: topicId },
            data: {
                title,
                content,
                slug: title.toLowerCase().replace(/\s+/g, "-"),
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to update topic.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getTopics(categoryId?: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const whereClause = categoryId ? { categoryId } : {};

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
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: [{ isPinned: "desc" }, { lastPostAt: "desc" }],
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

export async function getTopicById(topicId: number) {
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
                },
            },
        },
    });

    if (!topic) {
        throw new Error("Topic not found.");
    }

    return topic;
}

export async function toggleTopicPin(topicId: number, userId: number): Promise<void> {
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function toggleTopicLock(topicId: number, userId: number): Promise<void> {
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
