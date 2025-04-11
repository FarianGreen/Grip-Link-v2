import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getSocket } from "../services/socket";
import { addMessage } from "../store/chatSlice";
import { addNotification } from "../store/notificationsSlice";

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );

  const socket = getSocket();

  const sendMessage = () => {
    if (!message.trim() || !selectedChatId || !user) return;

    const messageData = {
      chatId: selectedChatId,
      senderId: user?.id,
      content: message,
      sender: user,
    };

    socket.emit("sendMessage", messageData);
    dispatch(
      addMessage({
        id: Date.now(),
        ...messageData,
        createdAt: new Date().toISOString(),
      })
    );

    setMessage("");
  };
  const handleClick = () => {
    dispatch(addNotification({ message: "✅ Всё работает!", type: "success" }));
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
      />
      <button onClick={sendMessage}>Отправить</button>
      <button onClick={handleClick}>Показать уведомление</button>
    </div>
  );
};

export default MessageInput;
