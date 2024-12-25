"use server";

import { prisma } from "../../../prisma/config/prisma";

export const getUserInbox = async (page: number = 1, userLoggedInId: number) => {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: {
                receiverId: userLoggedInId,
            },
            include: {
                sender: {
                    include: {
                        avatar: true,
                    },
                },
                receiver: {
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
        prisma.message.count({
            where: {
                receiverId: userLoggedInId,
            },
        }),
    ]);

    return {
        items: messages,
        total,
    };
};

export const getSentMessages = async (page: number = 1, userLoggedInId: number) => {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: {
                senderId: userLoggedInId,
            },
            include: {
                receiver: {
                    include: {
                        avatar: true,
                    },
                },
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
        prisma.message.count({
            where: {
                senderId: userLoggedInId,
            },
        }),
    ]);

    return {
        items: messages,
        total,
    };
};

export const sendMessage = async (receiverId: number, text: string, userLoggedInId: number) => {
    const inbox = await prisma.inbox.create({
        data: {
            participants: {
                create: [{ userId: userLoggedInId }, { userId: receiverId }],
            },
        },
    });

    const message = await prisma.message.create({
        data: {
            text,
            senderId: userLoggedInId,
            receiverId,
            inboxId: inbox.id,
        },
    });

    return message;
};

export const deleteMessage = async (messageId: number) => {
    try {
        await prisma.message.delete({
            where: {
                id: messageId,
            },
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};

export const searchUsers = async (query: string, currentUserId: number) => {
    if (!query) return [];

    const users = await prisma.user.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { userName: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                    ],
                },
                { NOT: { id: currentUserId } },
            ],
        },
        select: {
            id: true,
            userName: true,
            email: true,
            avatar: true,
        },
        take: 5,
    });

    return users;
};

export const getUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            userName: true,
            email: true,
            avatar: true,
        },
    });

    return user;
};

export const markMessageAsRead = async (messageId: number) => {
    await prisma.message.update({
        where: {
            id: messageId,
        },
        data: {
            read: true,
        },
    });
};

export const getTotalUnreadMessages = async (userId: number) => {
    const count = await prisma.message.count({
        where: {
            receiverId: userId,
            read: false,
        },
    });

    return count;
};

export const editMessage = async (messageId: number, text: string) => {
    try {
        await prisma.message.update({
            where: {
                id: messageId,
            },
            data: {
                text,
                editedAt: new Date(),
            },
        });
    } catch (error) {
        console.error("Error editing message:", error);
        throw error;
    }
};

export const getMessageById = async (messageId: number) => {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
        include: {
            sender: {
                include: {
                    avatar: true,
                },
            },
            receiver: {
                include: {
                    avatar: true,
                },
            },
        },
    });

    return message;
};

export const getUnreadMessagesCount = async (userId: number) => {
    const count = await prisma.message.count({
        where: {
            receiverId: userId,
            read: false,
        },
    });

    return count;
};
