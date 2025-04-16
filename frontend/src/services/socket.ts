import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket подключен:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WebSocket отключен:", reason);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("🔁 Попытка переподключения:", attempt);
    });

    socket.io.on("reconnect_error", (err) => {
      console.error("❌ Ошибка при переподключении:", err.message);
    });
  }

  return socket;
};

// export const getSocket = (): Socket => {
//   if (!socket) {
//     throw new Error("⛔ WebSocket ещё не инициализирован. Вызови initSocket() сначала.");
//   }
//   return socket;
// };