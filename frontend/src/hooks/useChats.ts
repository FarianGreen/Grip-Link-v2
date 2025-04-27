import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useChats = () => {
  return useSelector((state: RootState) => state.chat.chats);
};