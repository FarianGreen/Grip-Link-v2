import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

export const useChatMessages = () => {
  return useSelector((state: RootState) => state.chat.messages);
};