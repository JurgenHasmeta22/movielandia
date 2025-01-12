"use server";

import { Person, Prisma } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";
import { RatingsMap } from "./season.actions";
import { FilterOperator } from "@/types/filterOperators";

interface PersonModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    name?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

// #region "GET Methods"
export async function getPersonsWithFilters(
    {
        sortBy,
        ascOrDesc,
        perPage = 12,
        page = 1,
        name,
        filterValue,
        filterNameString,
        filterOperatorString,
    }: PersonModelParams,
    userId?: number,
): Promise<any | null> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (name) filters.name = { contains: name };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        if (filterOperatorString === "contains") {
            filters[filterNameString] = { contains: filterValue };
        } else {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }
    }

    orderByObject[sortBy || "fullname"] = ascOrDesc || "asc";

    const persons = await prisma.person.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    const personIds = persons.map((person: Person) => person.id);

    const personRatings = await prisma.personReview.groupBy({
        by: ["personId"],
        where: { personId: { in: personIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const personRatingsMap: RatingsMap = personRatings.reduce((map, rating) => {
        map[rating.personId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const personsFinal = await Promise.all(
        persons.map(async (person) => {
            const { ...properties } = person;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userPersonFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { personId: person.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = personRatingsMap[person.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const personsCount = await prisma.person.count();

    if (personsFinal) {
        return { persons: personsFinal, count: personsCount };
    } else {
        return null;
    }
}

export async function getPersons(): Promise<any | null> {
    const personsAll = await prisma.person.findMany();

    if (personsAll) {
        return personsAll;
    } else {
        return null;
    }
}

export async function getPersonById(personId: number, queryParams: any): Promise<Person | any | null> {
    const {
        reviewsPage,
        reviewsAscOrDesc,
        reviewsSortBy,
        upvotesPage,
        downvotesPage,
        userId,
        starredMoviesPage,
        starredSeriesPage,
    } = queryParams;

    const skip = reviewsPage ? (reviewsPage - 1) * 5 : 0;
    const take = 5;
    const orderByObject: any = {};

    if (reviewsSortBy && reviewsAscOrDesc) {
        orderByObject[reviewsSortBy] = reviewsAscOrDesc;
    } else {
        orderByObject["createdAt"] = "desc";
    }

    try {
        const person = await prisma.person.findFirst({
            where: {
                id: personId,
            },
            include: {
                partInMovies: {
                    include: { movie: true },
                    skip: starredMoviesPage ? (starredMoviesPage - 1) * 6 : 0,
                    take: 6,
                },
                partInSeries: {
                    include: { serie: true },
                    skip: starredSeriesPage ? (starredSeriesPage - 1) * 6 : 0,
                    take: 6,
                },
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

        if (person) {
            const totalReviews = await prisma.personReview.count({
                where: { personId: person.id },
            });

            const ratings = await prisma.personReview.findMany({
                where: { personId: person.id },
                select: { rating: true },
            });

            const totalRating = ratings.reduce((sum, review) => sum + review!.rating!, 0);
            const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

            let isBookmarked = false;
            let isReviewed = false;

            if (userId) {
                for (const review of person.reviews) {
                    const existingUpvote = await prisma.upvotePersonReview.findFirst({
                        where: {
                            AND: [{ userId }, { personId: person.id }, { personReviewId: review.id }],
                        },
                    });

                    const existingDownvote = await prisma.downvotePersonReview.findFirst({
                        where: {
                            AND: [{ userId }, { personId: person.id }, { personReviewId: review.id }],
                        },
                    });

                    // @ts-expect-error Type
                    review.isUpvoted = !!existingUpvote;

                    // @ts-expect-error Type
                    review.isDownvoted = !!existingDownvote;
                }

                const existingFavorite = await prisma.userPersonFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { personId: person.id }],
                    },
                });
                isBookmarked = !!existingFavorite;

                const existingReview = await prisma.personReview.findFirst({
                    where: {
                        AND: [{ userId }, { personId: person.id }],
                    },
                });
                isReviewed = !!existingReview;
            }

            const [totalMovies, totalSeries] = await Promise.all([
                prisma.personMovie.count({ where: { personId: person.id } }),
                prisma.personSerie.count({ where: { personId: person.id } }),
            ]);

            return {
                ...person,
                averageRating,
                totalReviews,
                totalMovies,
                totalSeries,
                ...(userId && { isBookmarked, isReviewed }),
            };
        } else {
            return "Person not found";
        }
    } catch (error) {
        throw new Error("Person not found");
    }
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updatePersonById(personParam: Prisma.PersonUpdateInput, id: string): Promise<Person | null> {
    const person: Person | null = await prisma.person.findUnique({
        where: { id: Number(id) },
    });

    if (person) {
        const personUpdated = await prisma.person.update({
            where: { id: Number(id) },
            data: personParam,
        });

        if (personUpdated) {
            return personUpdated;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function addPerson(personParam: Prisma.PersonCreateInput): Promise<Person | null> {
    try {
        const personCreated = await prisma.person.create({
            data: personParam,
        });

        if (personCreated) {
            return personCreated;
        }
    } catch (error) {
        console.error("Error creating person:", error);
        return null;
    }

    return null;
}

export async function deletePersonById(id: number): Promise<string | null> {
    const person: Person | null = await prisma.person.findUnique({
        where: { id },
    });

    if (person) {
        const result = await prisma.person.delete({
            where: { id },
        });

        if (result) {
            return "Person deleted successfully";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export async function searchPersonsByTitle(fullname: string, queryParams: any, userId?: number): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    orderByObject[sortBy || "fullname"] = ascOrDesc || "asc";

    const persons = await prisma.person.findMany({
        where: {
            fullname: { contains: fullname, mode: "insensitive" },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
    });

    const personIds = persons.map((person: Person) => person.id);

    const personRatings = await prisma.personReview.groupBy({
        by: ["personId"],
        where: { personId: { in: personIds } },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    const personRatingsMap: RatingsMap = personRatings.reduce((map, rating) => {
        map[rating.personId] = {
            averageRating: rating._avg.rating || 0,
            totalReviews: rating._count.rating,
        };

        return map;
    }, {} as RatingsMap);

    const personsFinal = await Promise.all(
        persons.map(async (person) => {
            const { ...properties } = person;

            let isBookmarked = false;

            if (userId) {
                const existingFavorite = await prisma.userPersonFavorite.findFirst({
                    where: {
                        AND: [{ userId }, { personId: person.id }],
                    },
                });

                isBookmarked = !!existingFavorite;
            }

            const ratingsInfo = personRatingsMap[person.id] || { averageRating: 0, totalReviews: 0 };

            return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
        }),
    );

    const count = await prisma.person.count({
        where: {
            fullname: { contains: fullname, mode: "insensitive" },
        },
    });

    if (persons) {
        return { persons: personsFinal, count };
    } else {
        return null;
    }
}
// #endregion
