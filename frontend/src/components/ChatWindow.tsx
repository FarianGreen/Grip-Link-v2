import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchMessages } from "../store/chatSlice";
import MessageInput from "./MessageInput";
import { initSocket } from "../services/socket";
import MessageItem from "./messageItem/MessageItem";
import { useJoinChatRoom } from "../hooks/useJoinChatRoom";

interface ChatWindowProps {
  chatId: number | null;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const selectedChatId = chatId;

  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { messages } = useSelector((state: RootState) => state.chat);

  useJoinChatRoom(chatId);
  useEffect(() => {
    const socket = initSocket();

    if (selectedChatId !== null && currentUserId) {
      dispatch(fetchMessages(selectedChatId));
      socket.emit("markAsRead", {
        chatId: selectedChatId,
        userId: currentUserId,
      });
    }
  }, [dispatch, selectedChatId]);

  return (
    <div className="chat-window">
      <div className="chat-window__tools">
        <h2>Чат #{selectedChatId ?? "не выбран"}</h2>
      </div>

      <div className="messages">
        {messages.length === 0 ? (
          <p>Сообщений пока нет</p>
        ) : (
          <div className="messages-outer">
            <div className="messages-inner">
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  currentUserId={currentUserId!}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedChatId && <MessageInput />}
    </div>
  );
};

export default ChatWindow;
