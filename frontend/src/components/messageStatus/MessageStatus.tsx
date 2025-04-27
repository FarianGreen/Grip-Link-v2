import React from "react";

interface MessageStatusProps {
  isSentByMe: boolean;
  readBy: { id: number }[] | undefined;
  currentUserId: number;
}

const MessageStatus: React.FC<MessageStatusProps> = ({
  isSentByMe,
  readBy,
  currentUserId,
}) => {
  if (!isSentByMe) return null;

  const isRead = readBy?.some((u) => u.id !== currentUserId);
  return <span className="message-status">{isRead ? "✅" : "🕑"}</span>;
};

export default MessageStatus;
