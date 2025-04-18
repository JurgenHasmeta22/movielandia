"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";
import { TopicStatus } from "@prisma/client";

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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
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
            throw new Error("Topic not found or you don't have permission to edit.");
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
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getTopics(
    categoryId?: number,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "lastPostAt",
    order: string = "desc",
    tagIds?: number[],
    status?: TopicStatus,
) {
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
        whereClause.status = status;
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
            orderBy: [{ isPinned: "desc" }, { [sortBy]: order }],
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

export async function getTopicById(topicId: number, includeViews: boolean = false) {
    // If includeViews is true, increment the view count
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
