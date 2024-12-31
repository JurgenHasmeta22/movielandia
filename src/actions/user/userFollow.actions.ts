"use server";

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

        await prisma.$transaction([
            prisma.userFollow.create({
                data: {
                    followerId,
                    followingId,
                    state: "pending",
                },
            }),
            prisma.notification.create({
                data: {
                    type: "follow_request",
                    content: "sent you a follow request",
                    userId: followingId,
                    senderId: followerId,
                    status: "unread",
                },
            }),
        ]);

        const referer = getReferer();
        revalidatePath(`${referer}`, "page");
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

export async function getFollowers(
    userId: number,
    userLoggedInId?: number | null,
    page: number = 1,
    limit: number = 10,
) {
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

    const followersWithStatus = await Promise.all(
        followers.map(async (follow) => {
            let followStatus = null;

            if (userLoggedInId) {
                const existingFollow = await prisma.userFollow.findFirst({
                    where: {
                        followerId: userLoggedInId,
                        followingId: follow.follower.id,
                    },
                });

                followStatus = existingFollow
                    ? {
                          isFollowing: true,
                          state: existingFollow.state,
                      }
                    : {
                          isFollowing: false,
                          state: null,
                      };
            }

            return {
                ...follow,
                follower: {
                    ...follow.follower,
                    followStatus,
                },
            };
        }),
    );

    return {
        items: followersWithStatus || [],
        total: total || 0,
    };
}

export async function getFollowing(
    userId: number,
    userLoggedInId?: number | null,
    page: number = 1,
    limit: number = 10,
) {
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

    const followingWithStatus = await Promise.all(
        following.map(async (follow) => {
            let followStatus = null;

            if (userLoggedInId) {
                const existingFollow = await prisma.userFollow.findFirst({
                    where: {
                        followerId: userLoggedInId,
                        followingId: follow.following.id,
                    },
                });

                followStatus = existingFollow
                    ? {
                          isFollowing: true,
                          state: existingFollow.state,
                      }
                    : {
                          isFollowing: false,
                          state: null,
                      };
            }

            return {
                ...follow,
                following: {
                    ...follow.following,
                    followStatus,
                },
            };
        }),
    );

    return {
        items: followingWithStatus || [],
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

export async function getUnreadNotificationsCount(userId: number): Promise<number> {
    return prisma.notification.count({
        where: {
            userId,
            status: "unread",
        },
    });
}

export async function getRecentNotifications(userId: number, limit: number = 5) {
    return prisma.notification.findMany({
        where: {
            userId,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    userName: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
    });
}

export async function markNotificationsAsRead(userId: number): Promise<void> {
    await prisma.notification.updateMany({
        where: {
            userId,
            status: "unread",
        },
        data: {
            status: "read",
        },
    });

    revalidatePath("/notifications");
}

export const getAllNotifications = async (userId: number, page: number = 1) => {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where: {
                userId: userId, // Changed from receiverId to userId
            },
            include: {
                sender: {
                    include: {
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: perPage,
        }),
        prisma.notification.count({
            where: {
                userId: userId, // Changed from receiverId to userId
            },
        }),
    ]);

    const notificationsWithReadStatus = notifications.map((notification) => ({
        ...notification,
        isRead: notification.status === "read",
    }));

    return {
        items: notificationsWithReadStatus,
        total,
    };
};

export async function getPaginatedNotifications(userId: number, page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;

    return prisma.notification.findMany({
        where: {
            userId,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    userName: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip,
        take: limit,
    });
}
