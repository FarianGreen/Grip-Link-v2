import { motion } from "framer-motion";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import EditMessageModal from "@/components/Modal/EditMessageModal";
import MessageStatus from "@/components/messageStatus/MessageStatus";
import { deleteMessageInChat } from "@/features/chat/chatApi";
import { IMessage } from "@/types";
import { Button } from "@/shared/ui/button";
import { DeleteIcon, EditIcon } from "../Icons";

interface Props {
  message: IMessage;
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
        className={`message ${isSentByMe ? "sent" : "received"}`}
      >
        <div className="message-header">
          <strong>{message.sender.name}</strong>
          {isSentByMe && (
            <div className="message-actions">
              <Button size="sm" onClick={handleOpenEdit}>
                <EditIcon color="white" size={15} />
              </Button>
              <Button size="sm" onClick={() => handleDelete(message.id)}>
                <DeleteIcon color="white" size={14} />
              </Button>
            </div>
          )}
        </div>
        <p>{message.content}</p>
        <div className="message-info">
          <MessageStatus
            isSentByMe={isSentByMe}
            readBy={message.readBy}
            currentUserId={currentUserId}
          />
          {message.isEdited && <small className="edited-label">(ред.)</small>}
        </div>
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
