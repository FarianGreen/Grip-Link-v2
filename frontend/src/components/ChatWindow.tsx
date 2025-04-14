import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchMessages } from "../store/chatSlice";
import MessageInput from "./MessageInput";
import { connectSocket } from "../services/socket";

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const { messages, selectedChatId } = useSelector(
    (state: RootState) => state.chat
  );

  useEffect(() => {
    connectSocket();
    if (selectedChatId !== null) {
      dispatch(fetchMessages(selectedChatId));
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
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender.id === currentUserId ? "sent" : "received"
                  }`}
                >
                  <strong>{msg.sender.name}:</strong> {msg.content}
                </div>
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
