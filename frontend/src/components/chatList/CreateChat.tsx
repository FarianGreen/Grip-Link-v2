import React from "react";

interface User {
  id: number;
  name: string;
}

interface Chat {
  users: User[];
}

interface CreateChatProps {
  users: User[];
  chats: Chat[];
  onCreateChat: (userId: number) => void;
}

const CreateChatComponent: React.FC<CreateChatProps> = ({ users, chats, onCreateChat }) => {
  const availableUsers = users.filter(
    (u) => !chats.some((c) => c.users.some((cu) => cu.id === u.id))
  );

  if (availableUsers.length === 0) return null;

  return (
    <div className="chat-list__create">
      <h3>Создать чат</h3>
      {availableUsers.map((user) => (
        <button key={user.id} onClick={() => onCreateChat(user.id)}>
          Создать чат с {user.name}
        </button>
      ))}
    </div>
  );
};

export const CreateChat = React.memo(CreateChatComponent);