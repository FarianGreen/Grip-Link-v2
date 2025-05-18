import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "@/app/store";

export const useSelectedChat = () => {
  const { selectedChatId, chats } = useSelector((state: RootState) => state.chat);
  return useMemo(() => chats.find((c) => c.chatId === selectedChatId), [chats, selectedChatId]);
};