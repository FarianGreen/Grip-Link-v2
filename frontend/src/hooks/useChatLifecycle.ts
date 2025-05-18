import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { useJoinChatRoom } from "./useJoinChatRoom";
import { fetchMessages } from "@/features/chat/chatThunks";


export const useChatLifecycle = (chatId: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useJoinChatRoom(chatId);

  useEffect(() => {
    if (chatId && userId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch, userId]);
};