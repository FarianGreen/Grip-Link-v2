import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useChatMessages = () => {
  return useSelector((state: RootState) => state.chat.messages);
};