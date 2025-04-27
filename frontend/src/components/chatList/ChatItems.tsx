import React from "react";

interface User {
  id: number;
  name: string;
}

interface Chat {
  chatId: number;
  users: User[];
  lastMessage?: string;
}

interface ChatItemsProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onDeleteChat: (e: React.MouseEvent, chatId: number) => void;
}

const ChatListItemsComponent: React.FC<ChatItemsProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onDeleteChat,
}) => {
  if (chats.length === 0) {
    return <p>Нет чатов</p>;
  }
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat.chatId}
          className={`chat-item ${
            selectedChatId === chat.chatId ? "active" : ""
          }`}
          onClick={() => onSelectChat(chat.chatId)}
        >
          <p>
            Чат #{chat.chatId} — {chat.users.map((u) => u.name).join(", ")}
          </p>
          {chat.lastMessage && (
            <small>Последнее сообщение: {chat.lastMessage}</small>
          )}
          <button
            onClick={(e) => {
              onDeleteChat(e, chat.chatId);
            }}
          >
            Удалить
          </button>
        </div>
      ))}
    </>
  );
};
export const ChatListItems = React.memo(ChatListItemsComponent);