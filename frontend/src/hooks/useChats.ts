import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

export const useChats = () => {
  return useSelector((state: RootState) => state.chat.chats);
};