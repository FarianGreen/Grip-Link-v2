import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  createChat,
  deleteChat,
  setSelectedChat,
} from "../../store/chatSlice";
import { fetchAllUsers } from "../../store/authSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import AddUsersModal from "../Modal/AddUsersModal";
import { useChats } from "../../hooks/useChats";
import { useSelectedChat } from "../../hooks/useSelectedChat";
import { ChatListItems } from "./ChatItems";
import { CreateChat } from "./CreateChat";

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

      <button
        onClick={modal.open}
        className={`${!selectedChatId ? "disable" : "open-modal-btn"}`}
      >
        ➕ Добавить пользователя
      </button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        {selectedChatId && (
          <AddUsersModal chatId={selectedChatId} onClose={modal.close} />
        )}
      </Modal>
    </div>
  );
};

export default ChatList;
