import { useSelectedChat } from "./useSelectedChat";

export const useChatUsers = () => {
  const selectedChat = useSelectedChat();
  return selectedChat?.users || [];
};