import { useEffect } from "react";
import { initSocket } from "../services/socket";

export const useJoinChatRoom = (chatId: number | null) => {
  useEffect(() => {
    if (chatId) {
      const socket = initSocket();
      socket.emit("joinChat", chatId);
    }
  }, [chatId]);
};