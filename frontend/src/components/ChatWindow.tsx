import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchMessages } from "../store/chatSlice";
import MessageInput from "./MessageInput";
import { initSocket } from "../services/socket";
import { motion } from "framer-motion";

interface ChatWindowProps {
  chatId: number | null;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const selectedChatId = chatId;

  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { messages } = useSelector((state: RootState) => state.chat);

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
              {messages.map((msg) => {
                const isSentByMe = msg.sender.id === currentUserId;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`message ${isSentByMe ? "sent" : "received"} ${
                      !msg.isRead ? "unread" : ""
                    }`}
                  >
                    <strong>{msg.sender.name}:</strong> {msg.content}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {selectedChatId && <MessageInput />}
    </div>
  );
};

export default ChatWindow;
