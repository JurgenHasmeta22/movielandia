import { prisma } from "../../../prisma/config/prisma";

export async function getUserFavorites(
    userId: number,
    subTab: "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);

    const [items, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`]: {
                    include: {
                        [singularSubTab]: true,
                    },
                    take: limit,
                    skip,
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`_count`]: {
                    select: {
                        [`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`]: true,
                    },
                },
            },
        }),
    ]);

    return {
        items: items?.[`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`] || [],
        total: total?._count?.[`fav${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`] || 0,
    };
}

export async function getUserReviews(
    userId: number,
    subTab: "movies" | "series" | "seasons" | "episodes" | "actors" | "crew",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);

    const [reviews, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`${singularSubTab}Reviews`]: {
                    include: {
                        [singularSubTab]: true,
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                    take: limit,
                    skip,
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`_count`]: {
                    select: {
                        [`${singularSubTab}Reviews`]: true,
                    },
                },
            },
        }),
    ]);

    return {
        items: reviews?.[`${singularSubTab}Reviews`] || [],
        total: total?._count?.[`${singularSubTab}Reviews`] || 0,
    };
}

export async function getUserVotes(
    userId: number,
    subTab: "movies" | "series" | "seasons" | "episodes" | "actors" | "crew",
    mainTab: "upvotes" | "downvotes",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);
    const type = mainTab === "upvotes" ? "upvoted" : mainTab === "downvotes" ? "downvoted" : mainTab;

    const [votes, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`]: {
                    include: {
                        [`${singularSubTab}Review`]: {
                            include: {
                                user: { include: { avatar: true } },
                                [singularSubTab]: true,
                                _count: {
                                    select: {
                                        upvotes: true,
                                        downvotes: true,
                                    },
                                },
                            },
                        },
                        [singularSubTab]: true,
                    },
                    take: limit,
                    skip,
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`_count`]: {
                    select: {
                        [`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`]: true,
                    },
                },
            },
        }),
    ]);

    return {
        items: votes?.[`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`] || [],
        total: total?._count?.[`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0,
    };
}
