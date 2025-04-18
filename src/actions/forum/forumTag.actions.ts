"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

export async function createTag(name: string, description?: string, color?: string): Promise<any> {
    try {
        const result = await prisma.forumTag.create({
            data: {
                name,
                description,
                color,
            },
        });

        if (!result) {
            throw new Error("Failed to create tag.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
        return result;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function updateTag(id: number, name: string, description?: string, color?: string): Promise<any> {
    try {
        const result = await prisma.forumTag.update({
            where: { id },
            data: {
                name,
                description,
                color,
            },
        });

        if (!result) {
            throw new Error("Failed to update tag.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
        return result;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function deleteTag(id: number): Promise<void> {
    try {
        await prisma.forumTag.delete({
            where: { id },
        });

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getAllTags(): Promise<any[]> {
    try {
        return await prisma.forumTag.findMany({
            orderBy: { name: "asc" },
        });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getTagById(id: number): Promise<any> {
    try {
        const tag = await prisma.forumTag.findUnique({
            where: { id },
        });

        if (!tag) {
            throw new Error("Tag not found.");
        }

        return tag;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addTagsToTopic(topicId: number, tagIds: number[]): Promise<void> {
    try {
        // First, disconnect all existing tags
        await prisma.forumTopic.update({
            where: { id: topicId },
            data: {
                tags: {
                    set: [],
                },
            },
        });

        // Then, connect the new tags
        await prisma.forumTopic.update({
            where: { id: topicId },
            data: {
                tags: {
                    connect: tagIds.map((id) => ({ id })),
                },
            },
        });

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getTopicsByTagId(tagId: number, page: number = 1, limit: number = 10): Promise<any> {
    try {
        const skip = (page - 1) * limit;

        const [topics, total] = await Promise.all([
            prisma.forumTopic.findMany({
                where: {
                    tags: {
                        some: {
                            id: tagId,
                        },
                    },
                },
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
                orderBy: [{ isPinned: "desc" }, { lastPostAt: "desc" }],
                skip,
                take: limit,
            }),
            prisma.forumTopic.count({
                where: {
                    tags: {
                        some: {
                            id: tagId,
                        },
                    },
                },
            }),
        ]);

        return {
            items: topics || [],
            total: total || 0,
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
