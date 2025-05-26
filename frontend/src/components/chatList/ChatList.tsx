import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import AddUsersModal from "../Modal/AddUsersModal";
import { useChats } from "../../hooks/useChats";
import { useSelectedChat } from "../../hooks/useSelectedChat";
import { ChatListItems } from "./ChatItems";
import { CreateChat } from "./CreateChat";
import { AppDispatch, RootState } from "@/app/store";
import { createChat, deleteChat, fetchChats } from "@/features/chat/chatThunks";
import { fetchAllUsers } from "@/features/auth/authThunks";
import { setSelectedChat } from "@/features/chat/chatSlice";
import { AddUserIcon } from "../Icons";
import { Button } from "@/shared/ui/button";

const ChatList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useChats();
  const selectedChat = useSelectedChat();
  const selectedChatId = selectedChat ? selectedChat.chatId : null;
  const users = useSelector((state: RootState) => state.auth.users);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const modal = useModal();

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleCreateChat = useCallback(
    (userId: number) => {
      if (!currentUserId) return;
      dispatch(createChat([userId, currentUserId]));
    },
    [dispatch]
  );

  const handleDeleteChat = useCallback(
    (e: React.MouseEvent, chatId: number) => {
      e.stopPropagation();
      dispatch(deleteChat(chatId));
    },
    [dispatch]
  );

  const handleSelectChat = useCallback(
    (chatId: number) => {
      dispatch(setSelectedChat(chatId));
    },
    [dispatch]
  );

  return (
    <div className="chat-list">
      <div className="chat-list__tools">
        <h2>Чаты</h2>
      </div>

      <ChatListItems
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <CreateChat users={users} chats={chats} onCreateChat={handleCreateChat} />

      <Button
        onClick={modal.open}
        className={!selectedChatId ? "disable" : "open-modal-btn"}
        size="md"
        leftIcon={<AddUserIcon size={18} color="white" />}
      >
        Добавить пользователя
      </Button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        {selectedChatId && (
          <AddUsersModal chatId={selectedChatId} onClose={modal.close} />
        )}
      </Modal>
    </div>
  );
};

export default ChatList;
