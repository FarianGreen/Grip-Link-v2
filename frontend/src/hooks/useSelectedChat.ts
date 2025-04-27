import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useMemo } from "react";

export const useSelectedChat = () => {
  const { selectedChatId, chats } = useSelector((state: RootState) => state.chat);
  return useMemo(() => chats.find((c) => c.chatId === selectedChatId), [chats, selectedChatId]);
};