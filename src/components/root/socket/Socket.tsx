"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useSession } from "next-auth/react";

export default function Socket() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const { data: session } = useSession();

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });

            if (!session?.user) {
                socket.emit("newUser", !session?.user.userName);
            }
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [!session?.user]);

    return <span></span>;
}
