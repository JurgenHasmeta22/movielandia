import { io as socketIOClient } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const socket = socketIOClient(SOCKET_URL, {
    autoConnect: false,
});

export const connectSocket = (userId: number) => {
    if (!socket.connected) {
        socket.connect();
        socket.emit("addUser", userId);
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
