import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  createChat,
  deleteChat,
  setSelectedChat,
} from "../store/chatSlice";
import { fetchAllUsers } from "../store/authSlice";
import { RootState, AppDispatch } from "../store/store";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal/Modal";
import AddUsersModal from "./Modal/AddUsersModal";
import { useChats } from "../hooks/useChats";
import { useSelectedChat } from "../hooks/useSelectedChat";

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

  const handleCreateChat = (userId: number) => {
    if (!currentUserId) return;
    dispatch(createChat([userId, currentUserId]));
  };

  const handleDeleteChat = (chatId: number) => {
    dispatch(deleteChat(chatId));
  };

  return (
    <div className="chat-list">
      <div className="chat-list__tools">
        <h2>Чаты</h2>
      </div>

      {chats.length === 0 ? (
        <p>Нет чатов</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.chatId}
            className={`chat-item ${
              selectedChatId === chat.chatId ? "active" : ""
            }`}
            onClick={() => dispatch(setSelectedChat(chat.chatId))}
          >
            <p>
              Чат #{chat.chatId} — {chat.users.map((u) => u.name).join(", ")}
            </p>
            {chat.lastMessage && (
              <small>Последнее сообщение: {chat.lastMessage.content}</small>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.chatId);
              }}
            >
              Удалить
            </button>
          </div>
        ))
      )}

      <div className="chat-list__create">
        <h3>Создать чат</h3>
        {users
          .filter(
            (u) => !chats.some((c) => c.users.some((cu) => cu.id === u.id))
          )
          .map((user) => (
            <button key={user.id} onClick={() => handleCreateChat(user.id)}>
              Создать чат с {user.name}
            </button>
          ))}
      </div>
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
