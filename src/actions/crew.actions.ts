"use server";

import { Crew, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { RatingsMap } from "./season.actions";

interface CrewModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    fullname?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: ">" | "=" | "<" | "gt" | "equals" | "lt";
}

// #region "GET Methods"
export async function getCrewMembersWithFilters(
    {
        sortBy,
        ascOrDesc,
        perPage = 12,
        page = 1,
        fullname,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: CrewModelParams,
    userId?: number,
): Promise<any | null> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (fullname) filters.fullname = { contains: fullname };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
        filters[filterNameString] = { [operator]: filterValue };
    }

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const crew = await prisma.crew.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    const crewIds = crew.map((crew: Crew) => crew.id);

    const crewRatings = await prisma.crewReview.groupBy({
        by: ["crewId"],
        where: { crewId: { in: crewIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const crewRatingsMap: RatingsMap = crewRatings.reduce((map, rating) => {
        map[rating.crewId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const crewFinal = await Promise.all(
        crew.map(async (crewMember) => {
            const { ...properties } = crewMember;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userCrewFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { crewId: crewMember.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = crewRatingsMap[crewMember.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const crewsCount = await prisma.crew.count();

    if (crewFinal) {
        return { crewMembers: crewFinal, count: crewsCount };
    } else {
        return null;
    }
}

export async function getCrewMembers(): Promise<any | null> {
    const crewMembersAll = await prisma.crew.findMany();

    if (crewMembersAll) {
        return crewMembersAll;
    } else {
        return null;
    }
}

export async function getCrewMemberById(crewId: number, queryParams: any): Promise<Crew | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;

    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;
    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const crewMember = await prisma.crew.findFirst({
            where: {
                id: crewId,
            },
            include: {
                producedMovies: { include: { movie: true } },
                producedSeries: { include: { serie: true } },
                reviews: {
                    include: {
                        user: true,
                        upvotes: {
                            take: upvotesPage ? upvotesPage * 5 : 5,
                            select: { user: true },
                        },
                        downvotes: {
                            take: downvotesPage ? downvotesPage * 5 : 5,
                            select: { user: true },
                        },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                    orderBy: orderByObject,
                    skip: skip,
                    take: take,
                },
            },
        });

        if (crewMember) {
            const totalReviews = await prisma.crewReview.count({
                where: { crewId: crewMember.id },
            });

            const ratings = await prisma.crewReview.findMany({
                where: { crewId: crewMember.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of crewMember.reviews) {
                    const existingUpvote = await prisma.upvoteCrewReview.findFirst({
                        where: {
                            AND: [{ userId }, { crewId: crewMember.id }, { crewReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteCrewReview.findFirst({
                        where: {
                            AND: [{ userId }, { crewId: crewMember.id }, { crewReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error type
                    review.isUpvoted = !!existingUpvote;

                    // @ts-expect-error type
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userCrewFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { crewId: crewMember.id }],
                    },
                });
                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.crewReview.findFirst({
                    where: {
                        AND: [{ userId }, { crewId: crewMember.id }],
                    },
                });
                isReviewed = !!existingReview;
            }

            return {
                ...crewMember,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Crew not found");
        }
    } catch (error) {
        throw new Error("Crew not found");
    }
}

export async function getCrewMemberByFullname(crewFullname: string, queryParams: any): Promise<Crew | any | null> {
    const { page, ascOrDesc, sortBy, upvotesPage, downvotesPage, userId } = queryParams;

    const skip = page ? (page - 1) * 5 : 0;
    const take = 5;

    const orderByObject: any = {};
    const fullnameFinal = crewFullname
        .split("")
        .map((char) => (char === "-" ? " " : char))
        .join("");

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const crewMember = await prisma.crew.findFirst({
            where: {
                fullname: fullnameFinal,
            },
            include: {
                producedMovies: { include: { movie: true } },
                producedSeries: { include: { serie: true } },
                reviews: {
                    include: {
                        user: true,
                        upvotes: {
                            take: upvotesPage ? upvotesPage * 5 : 5,
                            select: { user: true },
                        },
                        downvotes: {
                            take: downvotesPage ? downvotesPage * 5 : 5,
                            select: { user: true },
                        },
                        _count: {
                            select: {
                                upvotes: true,
                                downvotes: true,
                            },
                        },
                    },
                    orderBy: orderByObject,
                    skip: skip,
                    take: take,
                },
            },
        });

        if (crewMember) {
            const totalReviews = await prisma.crewReview.count({
                where: { crewId: crewMember.id },
            });

            const ratings = await prisma.crewReview.findMany({
                where: { crewId: crewMember.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of crewMember.reviews) {
                    const existingUpvote = await prisma.upvoteCrewReview.findFirst({
                        where: {
                            AND: [{ userId }, { crewId: crewMember.id }, { crewReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvoteCrewReview.findFirst({
                        where: {
                            AND: [{ userId }, { crewId: crewMember.id }, { crewReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error type
                    review.isUpvoted = !!existingUpvote;
                    // @ts-expect-error type
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userCrewFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { crewId: crewMember.id }],
                    },
                });
                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.crewReview.findFirst({
                    where: {
                        AND: [{ userId }, { crewId: crewMember.id }],
                    },
                });
                isReviewed = !!existingReview;
            }

            return {
                ...crewMember,
                averageRating,
                totalReviews,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            throw new Error("Crew not found");
        }
    } catch (error) {
        throw new Error("Crew not found");
    }
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updateCrewMemberById(crewParam: Prisma.CrewUpdateInput, id: string): Promise<Crew | null> {
    const crewMember: Crew | null = await prisma.crew.findUnique({
        where: { id: Number(id) },
    });

    if (crewMember) {
        const crewMemmberUpdated = await prisma.crew.update({
            where: { id: Number(id) },
            data: crewParam,
        });

        if (crewMemmberUpdated) {
            return crewMemmberUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addCrewMember(crewParam: Crew): Promise<Crew | null> {
    const crewMemberCreated = await prisma.crew.create({
        data: crewParam,
    });

    if (crewMemberCreated) {
        return crewMemberCreated;
    } else {
        return null;
    }
}

export async function deleteCrewMemberById(id: number): Promise<string | null> {
    const crewMember: Crew | null = await prisma.crew.findUnique({
        where: { id },
    });

    if (crewMember) {
        const result = await prisma.crew.delete({
            where: { id },
        });

        if (result) {
            return "Crew deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchCrewMembersByTitle(
    fullname: string,
    queryParams: any,
    userId?: number,
): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const query = {
        where: {
            fullname: { contains: fullname },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
    };

    const crews = await prisma.crew.findMany(query);
    const crewIds = crews.map((crew: Crew) => crew.id);

    const crewRatings = await prisma.crewReview.groupBy({
        by: ["crewId"],
        where: { crewId: { in: crewIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const crewRatingsMap: RatingsMap = crewRatings.reduce((map, rating) => {
        map[rating.crewId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const crewsFinal = await Promise.all(
        crews.map(async (crew) => {
            const { ...properties } = crew;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userCrewFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { crewId: crew.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = crewRatingsMap[crew.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const count = await prisma.crew.count({
        where: {
            fullname: { contains: fullname },
        },
    });

    if (crews) {
        return { crews: crewsFinal, count };
    } else {
        return null;
    }
}
// #endregion
