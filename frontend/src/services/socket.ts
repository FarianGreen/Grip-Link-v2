import { io, Socket } from "socket.io-client";
import store from "../store/store";
import {
  addMessage,
  deleteMessage,
  updateMessage,
  updateChat,
} from "../store/chatSlice";

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
      console.log("✅ Socket подключен:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket отключён:", reason);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("🔁 Попытка переподключения:", attempt);
    });

    socket.io.on("reconnect_error", (err) => {
      console.error("❌ Ошибка переподключения:", err.message);
    });

    // 💬 Сообщения
    socket.on("receiveMessage", (msg) => {
      console.log("📩 Получено сообщение:", msg);
      store.dispatch(addMessage(msg));
    });

    socket.on("message:updated", (msg) => {
      store.dispatch(updateMessage(msg));
    });

    socket.on("message:deleted", ({ id }) => {
      store.dispatch(deleteMessage(id));
    });

    // 🔄 Чаты
    socket.on("chat:updated", (chat) => {
      store.dispatch(updateChat(chat));
    });
  }

  return socket;
};
