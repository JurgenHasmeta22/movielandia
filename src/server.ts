import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma/config/prisma";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ["GET", "POST"],
    },
});

interface OnlineUser {
    userId: number;
    socketId: string;
}

let onlineUsers: OnlineUser[] = [];

io.on("connection", (socket) => {
    socket.on("addUser", (userId: number) => {
        const existingUser = onlineUsers.find((user) => user.userId === userId);

        if (!existingUser) {
            onlineUsers.push({ userId, socketId: socket.id });
        }

        io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text, inboxId }) => {
        const receiver = onlineUsers.find((user) => user.userId === receiverId);

        const message = await prisma.message.create({
            data: {
                text,
                senderId,
                receiverId,
                inboxId,
            },
            include: {
                sender: {
                    include: {
                        avatar: true,
                    },
                },
            },
        });

        await prisma.notification.create({
            data: {
                type: "message_received",
                content: `New message from ${message.sender.userName}`,
                userId: receiverId,
                senderId,
                status: "unread",
            },
        });

        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", message);

            io.to(receiver.socketId).emit("getNotification", {
                type: "message_received",
                senderId,
                content: `New message from ${message.sender.userName}`,
            });
        }
    });

    socket.on("sendNotification", async ({ type, receiverId, senderId, content }) => {
        const receiver = onlineUsers.find((user) => user.userId === receiverId);

        const notification = await prisma.notification.create({
            data: {
                type,
                content,
                userId: receiverId,
                senderId,
                status: "unread",
            },
        });

        if (receiver) {
            io.to(receiver.socketId).emit("getNotification", notification);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

const port = process.env.SOCKET_PORT || 3001;

httpServer.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}`);
});

export { io };
