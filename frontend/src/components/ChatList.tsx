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

const ChatList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector((state: RootState) => state.chat.chats);
  const selectedChatId = useSelector(
    (state: RootState) => state.chat.selectedChatId
  );
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
            <button onClick={() => handleDeleteChat(chat.chatId)}>
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
      <button onClick={modal.open} className="open-modal-btn">
        ➕ Добавить пользователя
      </button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <form className="modal-form">
          <h2 className="modal-form__title">Добавление пользователя</h2>
          <p className="modal-form__subtitle">
            Здесь может быть форма выбора пользователей в чат
          </p>
          <button onClick={modal.close}>Закрыть</button>
        </form>
      </Modal>
    </div>
  );
};

export default ChatList;
