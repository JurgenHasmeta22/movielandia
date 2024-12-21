"use server";

import { prisma } from "../../../prisma/config/prisma";

export async function getUserFavorites(
    userId: number,
    type: "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
    page: number = 1,
    search: string = "",
) {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    try {
        let items: any[] = [];
        let total = 0;

        switch (type.toLowerCase()) {
            case "movies":
                [items, total] = await Promise.all([
                    prisma.userMovieFavorite.findMany({
                        where: {
                            userId,
                            movie: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            movie: true,
                        },
                        skip,
                        take: perPage,
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.userMovieFavorite.count({
                        where: {
                            userId,
                            movie: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    }),
                ]);
                break;

            case "series":
                [items, total] = await Promise.all([
                    prisma.userSerieFavorite.findMany({
                        where: {
                            userId,
                            serie: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            serie: true,
                        },
                        skip,
                        take: perPage,
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.userSerieFavorite.count({
                        where: {
                            userId,
                            serie: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    }),
                ]);
                break;

            case "actors":
                [items, total] = await Promise.all([
                    prisma.userActorFavorite.findMany({
                        where: {
                            userId,
                            actor: {
                                fullname: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            actor: true,
                        },
                        skip,
                        take: perPage,
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.userActorFavorite.count({
                        where: {
                            userId,
                            actor: {
                                fullname: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    }),
                ]);
                break;

            case "crew":
                [items, total] = await Promise.all([
                    prisma.userCrewFavorite.findMany({
                        where: {
                            userId,
                            crew: {
                                fullname: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            crew: true,
                        },
                        skip,
                        take: perPage,
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.userCrewFavorite.count({
                        where: {
                            userId,
                            crew: {
                                fullname: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    }),
                ]);
                break;

            case "seasons":
                [items, total] = await Promise.all([
                    prisma.userSeasonFavorite.findMany({
                        where: {
                            userId,
                            season: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            season: {
                                include: {
                                    serie: true,
                                },
                            },
                        },
                        skip,
                        take: perPage,
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.userSeasonFavorite.count({
                        where: {
                            userId,
                            season: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    }),
                ]);
                break;

            case "episodes":
                [items, total] = await Promise.all([
                    prisma.userEpisodeFavorite.findMany({
                        where: {
                            userId,
                            episode: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        include: {
                            episode: {
                                include: {
                                    season: {
                                        include: {
                                            serie: true,
                                        },
                                    },
                                },
                            },
                        },
                        skip,
                        take: perPage,
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.userEpisodeFavorite.count({
                        where: {
                            userId,
                            episode: {
                                title: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    }),
                ]);
                break;

            default:
                throw new Error("Invalid type specified");
        }

        return {
            items,
            total,
        };
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        throw error;
    }
}

export async function getUserReviews(
    userId: number,
    subTab: "movies" | "series" | "seasons" | "episodes" | "actors" | "crew",
    page: number = 1,
    search: string = "",
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);

    const titleField = singularSubTab === "actor" || singularSubTab === "crew" ? "fullname" : "title";

    const [reviews, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`${singularSubTab}Reviews`]: {
                    where: {
                        [singularSubTab]: {
                            [titleField]: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
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
    search: string = "",
    page: number = 1,
    limit: number = 10,
) {
    const skip = (page - 1) * limit;
    const singularSubTab = subTab === "crew" ? "crew" : subTab.slice(0, -1);
    const type = mainTab === "upvotes" ? "upvoted" : mainTab === "downvotes" ? "downvoted" : mainTab;
    const titleField = singularSubTab === "actor" || singularSubTab === "crew" ? "fullname" : "title";

    const [votes, total] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                [`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`]: {
                    where: {
                        [`${singularSubTab}Review`]: {
                            [singularSubTab]: {
                                [titleField]: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
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
                        [`${singularSubTab}Reviews${type.charAt(0).toUpperCase() + type.slice(1)}`]: {
                            where: {
                                [`${singularSubTab}Review`]: {
                                    [singularSubTab]: {
                                        [titleField]: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                        },
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
