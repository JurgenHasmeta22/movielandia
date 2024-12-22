"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/config/prisma";

export const getUserInbox = async (page: number = 1, userLoggedIn?: any) => {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: {
                receiverId: userLoggedIn.id,
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
                receiverId: userLoggedIn.id,
            },
        }),
    ]);

    return {
        items: messages,
        total,
    };
};

export const getSentMessages = async (page: number = 1, userLoggedIn?: any) => {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [messages, total] = await Promise.all([
        prisma.message.findMany({
            where: {
                senderId: userLoggedIn.id,
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
                senderId: userLoggedIn.id,
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

    revalidatePath("/messages");
    return message;
};

export const deleteMessage = async (messageId: number) => {
    await prisma.message.delete({
        where: {
            id: messageId,
        },
    });

    revalidatePath("/messages");
};

export const getAllUsers = async (userLoggedIn?: any) => {
    const users = await prisma.user.findMany({
        where: {
            NOT: {
                id: userLoggedIn.id,
            },
        },
        select: {
            id: true,
            userName: true,
            email: true,
            avatar: true,
        },
    });

    return users;
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
