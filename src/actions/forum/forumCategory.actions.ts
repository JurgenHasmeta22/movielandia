"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

export async function createCategory(name: string, description: string, order: number = 0): Promise<void> {
    try {
        const result = await prisma.forumCategory.create({
            data: {
                name,
                description,
                order,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                isActive: true,
                topicCount: 0,
                postCount: 0,
            },
        });

        if (!result) {
            throw new Error("Failed to create category.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function updateCategory(
    categoryId: number,
    name: string,
    description: string,
    order?: number,
    isActive?: boolean,
): Promise<void> {
    try {
        const category = await prisma.forumCategory.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            throw new Error("Category not found.");
        }

        const result = await prisma.forumCategory.update({
            where: { id: categoryId },
            data: {
                name,
                description,
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive }),
                slug: name.toLowerCase().replace(/\s+/g, "-"),
            },
        });

        if (!result) {
            throw new Error("Failed to update category.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getCategories(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
        prisma.forumCategory.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: {
                        topics: true,
                    },
                },
                lastPost: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                moderators: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ order: "asc" }, { name: "asc" }],
            skip,
            take: limit,
        }),
        prisma.forumCategory.count({
            where: { isActive: true },
        }),
    ]);

    return {
        items: categories || [],
        total: total || 0,
    };
}

export async function getCategoryById(categoryId: number) {
    const category = await prisma.forumCategory.findUnique({
        where: { id: categoryId },
        include: {
            _count: {
                select: {
                    topics: true,
                },
            },
            lastPost: {
                include: {
                    user: {
                        select: {
                            id: true,
                            userName: true,
                            avatar: true,
                        },
                    },
                },
            },
            moderators: {
                include: {
                    user: {
                        select: {
                            id: true,
                            userName: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;
}

export async function addModerator(categoryId: number, userId: number): Promise<void> {
    try {
        const result = await prisma.userForumModerator.create({
            data: {
                categoryId,
                userId,
            },
        });

        if (!result) {
            throw new Error("Failed to add moderator.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeModerator(categoryId: number, userId: number): Promise<void> {
    try {
        const result = await prisma.userForumModerator.deleteMany({
            where: {
                categoryId,
                userId,
            },
        });

        if (!result) {
            throw new Error("Failed to remove moderator.");
        }

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
