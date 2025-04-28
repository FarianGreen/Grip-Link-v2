import React from "react";
import { useMessageInput } from "../hooks/useMessageInput";
import { SendIcon } from "./Icons/SendIcon";


const MessageInput: React.FC = () => {
  const { message, setMessage, sendMessage, canSend } = useMessageInput();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canSend) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
      />
      <button disabled={!canSend} onClick={sendMessage}>
        <SendIcon size={22} color="#fff" />
      </button>
    </div>
  );
};

export default MessageInput;