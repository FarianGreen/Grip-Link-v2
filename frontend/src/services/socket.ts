import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket;

export const connectSocket = () => {
    socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
    });

    socket.on("connect", () => console.log("🔗 Подключено к WebSocket"));
    socket.on("disconnect", () => console.log("❌ Отключено от WebSocket"));
};

export const getSocket = (): Socket => socket;
