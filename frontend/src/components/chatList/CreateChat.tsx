import { Button } from "@/shared/ui/button";
import { IChat, IUser } from "@/types";
import React from "react";

interface CreateChatProps {
  users: IUser[];
  chats: IChat[];
  onCreateChat: (userId: number) => void;
}

const CreateChatComponent: React.FC<CreateChatProps> = ({
  users,
  chats,
  onCreateChat,
}) => {
  const availableUsers = users.filter(
    (u) => !chats.some((c) => c.users.some((cu) => cu.id === u.id))
  );

  if (availableUsers.length === 0) return null;

  return (
    <div className="chat-list__create">
      <h3>Создать чат</h3>
      {availableUsers.map((user) => (
        <Button  onClick={() => onCreateChat(user.id)} size="sm">
          Создать чат с {user.name}
        </Button>
      ))}
    </div>
  );
};

export const CreateChat = React.memo(CreateChatComponent);
