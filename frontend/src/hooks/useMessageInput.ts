import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { initSocket } from "@/services/socket";
import { debounce } from "@/utils/debounce";

export const useMessageInput = () => {
  const [message, setMessage] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );
  const chats = useSelector((state: RootState) => state.chat.chats);

  const socket = initSocket();

  const currentChat = chats.find((chat) => chat.chatId === selectedChatId);
  const receiver = currentChat?.users.find((u) => u.id !== user?.id);

  const rawSendMessage = useCallback(() => {
    if (!message.trim() || !selectedChatId || !user || !receiver) return;

    const msg = {
      chatId: selectedChatId,
      senderId: user.id,
      receiverId: receiver.id,
      content: message,
      sender: user,
    };

    socket.emit("sendMessage", msg);

    setMessage("");
  }, [message, selectedChatId, user, receiver, socket]);

  const sendMessage = useMemo(
    () => debounce(rawSendMessage, 300),
    [rawSendMessage]
  );

  return {
    message,
    setMessage,
    sendMessage,
    canSend: !!message.trim(),
  };
};
