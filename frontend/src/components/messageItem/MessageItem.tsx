import { motion } from "framer-motion";
import { useState } from "react";
import Modal from "../Modal/Modal";
import EditMessageModal from "../Modal/EditMessageModal";
import { deleteMessageInChat } from "../../store/chatSlice";

interface User {
  id: number;
  name: string;
  email: string;
}
interface Message {
  sender: User;
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  isRead?: boolean;
  isEdited?: boolean;
}
interface Props {
  message: Message;
  currentUserId: number;
}

const MessageItem = ({ message, currentUserId }: Props) => {
  const isSentByMe = message.sender.id === currentUserId;
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };
  const handleDelete = async (msgId: number) => {
    await deleteMessageInChat(msgId);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`message ${isSentByMe ? "sent" : "received"} ${
          !message.isRead ? "unread" : ""
        }`}
      >
        <div className="message-header">
          <strong>{message.sender.name}</strong>
          {isSentByMe && (
            <div className="message-actions">
              <button onClick={handleOpenEdit}>✏️</button>
              <button onClick={() => handleDelete(message.id)}>🗑</button>
            </div>
          )}
        </div>
        <p>{message.content}</p>
        {message.isEdited && <small className="edited-label">(ред.)</small>}
      </motion.div>

      <Modal isOpen={isEditing} onClose={handleCloseEdit}>
        <EditMessageModal
          messageId={message.id}
          initialContent={message.content}
          onClose={handleCloseEdit}
        />
      </Modal>
    </>
  );
};

export default MessageItem;
