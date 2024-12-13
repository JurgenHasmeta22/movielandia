import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "./user.actions";

export async function follow(followerId: number, followingId: number): Promise<void> {
    try {
        if (followerId === followingId) {
            throw new Error("You cannot follow yourself.");
        }

        const existingFollow = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }],
            },
        });

        if (existingFollow) {
            throw new Error("You already follow this user.");
        }

        const result = await prisma.userFollow.create({
            data: {
                followerId,
                followingId,
                state: "pending",
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to follow user.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function unfollow(followerId: number, followingId: number): Promise<void> {
    try {
        if (followerId === followingId) {
            throw new Error("You cannot unfollow yourself.");
        }

        const existingFollow = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }],
            },
        });

        if (!existingFollow) {
            throw new Error("You do not follow this user.");
        }

        const result = await prisma.userFollow.delete({
            where: {
                id: existingFollow.id,
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to unfollow user.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function acceptFollowRequest(followerId: number, followingId: number): Promise<void> {
    try {
        const followRequest = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }, { state: "pending" }],
            },
        });

        if (!followRequest) {
            throw new Error("No pending follow request found.");
        }

        const result = await prisma.userFollow.update({
            where: {
                id: followRequest.id,
            },
            data: {
                state: "accepted",
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to accept follow request.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function refuseFollowRequest(followerId: number, followingId: number): Promise<void> {
    try {
        const followRequest = await prisma.userFollow.findFirst({
            where: {
                AND: [{ followerId }, { followingId }, { state: "pending" }],
            },
        });

        if (!followRequest) {
            throw new Error("No pending follow request found.");
        }

        const result = await prisma.userFollow.delete({
            where: {
                id: followRequest.id,
            },
        });

        if (result) {
            const referer = getReferer();
            revalidatePath(`${referer}`, "page");
        } else {
            throw new Error("Failed to refuse follow request.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function getFollowers(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
        prisma.userFollow.findMany({
            where: {
                followingId: userId,
                state: "accepted",
            },
            include: {
                follower: {
                    include: {
                        avatar: true,
                    },
                },
            },
            take: limit,
            skip,
        }),
        prisma.userFollow.count({
            where: {
                followingId: userId,
                state: "accepted",
            },
        }),
    ]);

    return {
        items: followers || [],
        total: total || 0,
    };
}

export async function getFollowing(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
        prisma.userFollow.findMany({
            where: {
                followerId: userId,
                state: "accepted",
            },
            include: {
                following: {
                    include: {
                        avatar: true,
                    },
                },
            },
            take: limit,
            skip,
        }),
        prisma.userFollow.count({
            where: {
                followerId: userId,
                state: "accepted",
            },
        }),
    ]);

    return {
        items: following || [],
        total: total || 0,
    };
}

export async function getPendingFollowRequests(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [pendingRequests, total] = await Promise.all([
        prisma.userFollow.findMany({
            where: {
                followingId: userId,
                state: "pending",
            },
            include: {
                follower: {
                    include: {
                        avatar: true,
                    },
                },
            },
            take: limit,
            skip,
        }),
        prisma.userFollow.count({
            where: {
                followingId: userId,
                state: "pending",
            },
        }),
    ]);

    return {
        items: pendingRequests || [],
        total: total || 0,
    };
}
