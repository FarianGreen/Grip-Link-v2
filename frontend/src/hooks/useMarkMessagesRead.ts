import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";


import { initSocket } from "../services/socket";
import { markMessagesAsRead, markMessagesRead } from "../store/chatSlice";

export const useMarkMessagesRead = (chatId: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const socket = initSocket();

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const unreadMessageIds = messages
      .filter(
        (m) =>
          !m.readBy?.some((u) => u.id === currentUser.id) &&
          m.sender.id !== currentUser.id
      )
      .map((m) => m.id);

    if (unreadMessageIds.length > 0) {
      markMessagesRead(chatId, unreadMessageIds)
        .then(() => {
          dispatch(markMessagesAsRead({ userId: currentUser.id, messageIds: unreadMessageIds }));
        })
        .catch((err) => {
          console.error("Ошибка отметки сообщений прочитанными:", err);
        });
    }

    socket.on("message:read", ({ userId, messageIds }) => {
      dispatch(markMessagesAsRead({ userId, messageIds }));
    });

    return () => {
      socket.off("message:read");
    };
  }, [chatId, currentUser, messages]);
};