import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchMessages } from "../store/chatSlice";
import MessageInput from "./MessageInput";
import { connectSocket } from "../services/socket";

const ChatWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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
      <button>Удалить чат</button>
      </div>
      
      <div className="messages">
        {messages.length === 0 ? (
          <p>Сообщений пока нет</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <strong>{msg.sender.name}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>
      {selectedChatId && <MessageInput />}
    </div>
  );
};

export default ChatWindow;
