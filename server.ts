import { createServer } from "node:http";
import { Server } from "socket.io";
import { prisma } from "./prisma/config/prisma";
import next from "next";

interface OnlineUser {
    userId: number;
    socketId: string;
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 4000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let onlineUsers: OnlineUser[] = [];

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);

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

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
