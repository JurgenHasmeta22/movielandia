"use server";

import { headers } from "next/headers";
import { Prisma, User } from "@prisma/client";
import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { FilterOperator } from "@/types/filterOperators";
import { unstable_cacheLife as cacheLife } from "next/cache";

// #region "Interfaces"
export interface UserModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    title?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

export interface AddReviewMovieParams {
    content: string;
    createdAt?: Date;
    rating: number;
    userId: number;
    movieId: number;
}

export interface AddReviewSerieParams {
    content: string;
    createdAt?: Date;
    rating: number;
    userId: number;
    serieId: number;
}

export interface UpdateReviewMovieParams {
    content: string;
    rating: number;
    userId: number;
    movieId: number;
}

export interface UpdateReviewSerieParams {
    content: string;
    rating: number;
    userId: number;
    serieId: number;
}

export interface RemoveReviewMovieParams {
    userId: number;
    movieId: number;
}

export interface RemoveReviewSerieParams {
    userId: number;
    serieId: number;
}

export interface RemoveReviewSeasonParams {
    userId: number;
    seasonId: number;
}

export interface RemoveReviewEpisodeParams {
    userId: number;
    episodeId: number;
}

export interface RemoveReviewActorParams {
    userId: number;
    actorId: number;
}

export interface RemoveReviewCrewParams {
    userId: number;
    crewId: number;
}

export interface VoteMovieReviewParams {
    userId: number;
    movieId: number;
    movieReviewId: number;
}

export interface VoteSerieReviewParams {
    userId: number;
    serieId: number;
    serieReviewId: number;
}

export interface VoteSeasonReviewParams {
    userId: number;
    seasonId: number;
    seasonReviewId: number;
}

export interface VoteEpisodeReviewParams {
    userId: number;
    episodeId: number;
    episodeReviewId: number;
}

export interface VoteActorReviewParams {
    userId: number;
    actorId: number;
    actorReviewId: number;
}

export interface VoteCrewReviewParams {
    userId: number;
    crewId: number;
    crewReviewId: number;
}

export interface UserModelParams {
    sortBy?: string;
    ascOrDesc?: string;
    perPage?: number;
    page?: number;
    userName?: string | null;
    filterValue?: number | string;
    filterNameString?: string | null;
    filterOperatorString?: FilterOperator;
}

// #endregion

// #region "Utils"
export async function getReferer() {
    const headersList = headers() as any;
    const referer = headersList.get("referer");

    if (referer) {
        return referer;
    } else {
        return "/";
    }
}
// #endregion

// #region "CRUD"

// #region "GET Methods"
export async function getUsersWithFilters({
    sortBy,
    ascOrDesc,
    perPage = 12,
    page = 1,
    userName,
    filterValue,
    filterNameString,
    filterOperatorString,
}: UserModelParams): Promise<{ users: User[] }> {
    const filters: any = {};
    const orderByObject: any = {};

    const skip = (page - 1) * perPage;
    const take = perPage;

    if (userName) filters.userName = { contains: userName };

    if (filterValue !== undefined && filterNameString && filterOperatorString) {
        if (filterOperatorString === "contains") {
            filters[filterNameString] = { contains: filterValue };
        } else {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }
    }

    if (sortBy && ascOrDesc) {
        orderByObject[sortBy] = ascOrDesc;
    }

    const users = await prisma.user.findMany({
        where: filters,
        orderBy: orderByObject,
        skip,
        take,
    });

    return { users };
}

export async function getUsers(): Promise<any | null> {
    const users = await prisma.user.findMany();

    if (users) {
        return users;
    } else {
        return null;
    }
}

export async function getUsersTotalCount(): Promise<number> {
    "use cache";

    cacheLife("days");

    try {
        const count = await prisma.user.count();
        return count;
    } catch (error: unknown) {
        console.error("Error fetching users total count:", error);
        throw new Error("Could not retrieve users count");
    }
}

export async function getUserById(userId: number, userLoggedInId?: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            avatar: true,
        },
    });

    if (user) {
        let isFollowed: boolean = false;
        let isFollowedStatus: string | null = null;

        if (userLoggedInId) {
            const existingFollow = await prisma.userFollow.findFirst({
                where: {
                    followerId: userLoggedInId,
                    followingId: userId,
                },
            });

            if (existingFollow) {
                isFollowed = true;
                isFollowedStatus = existingFollow.state;
            }
        }

        return { ...user, ...(userLoggedInId && { isFollowed, isFollowedStatus }) };
    }

    return null;
}

export async function getUsernameByUserId(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { userName: true },
    });

    try {
        if (user) {
            return user.userName;
        } else {
            throw new Error("User not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getUserByUsername(userName: string, userLoggedInId: number): Promise<User | null> {
    const user = await prisma.user.findFirst({
        where: { userName },
        include: {
            avatar: true,
        },
    });

    if (user) {
        let isFollowed: boolean = false;
        let isFollowedStatus: string | null = null;

        if (userLoggedInId) {
            const existingFollow = await prisma.userFollow.findFirst({
                where: {
                    followerId: userLoggedInId,
                },
            });

            if (existingFollow) {
                isFollowed = true;
                isFollowedStatus = existingFollow.state;
            }
        }

        return { ...user, ...(userLoggedInId && { isFollowed, isFollowedStatus }) };
    } else {
        return null;
    }
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function updateUserByIdAdmin(userParam: Prisma.UserUpdateInput, id: number): Promise<User | null> {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: userParam,
        });

        if (updatedUser) {
            return updatedUser;
            // revalidatePath(`/users/${updatedUser.id}/${updatedUser.userName}`, "page");
        } else {
            // throw new Error("Failed to update user.");
            return null;
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function updateUserById(userParam: Prisma.UserUpdateInput, id: number): Promise<void> {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: userParam,
        });

        if (updatedUser) {
            revalidatePath(`/users/${updatedUser.id}/${updatedUser.userName}`, "page");
        } else {
            throw new Error("Failed to update user.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function deleteUserById(id: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (user) {
        await prisma.user.delete({
            where: { id },
        });
        return "User deleted successfully";
    } else {
        return null;
    }
}

export async function searchUsersByUsername(userName: string, queryParams: any): Promise<any | null> {
    const { page, ascOrDesc, sortBy } = queryParams;
    const orderByObject: any = {};

    orderByObject[sortBy || "userName"] = ascOrDesc || "asc";

    const users = await prisma.user.findMany({
        where: {
            userName: { contains: userName, mode: "insensitive" },
        },
        orderBy: orderByObject,
        skip: page ? (page - 1) * 12 : 0,
        take: 12,
    });

    const count = await prisma.user.count({
        where: {
            userName: { contains: userName, mode: "insensitive" },
        },
    });

    if (users) {
        return { users, count };
    } else {
        return null;
    }
}
// #endregion

// #endregion
