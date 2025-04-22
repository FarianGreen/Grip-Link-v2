import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./modal.scss";
import { updateChatUsers } from "../../store/chatSlice";

interface Props {
  chatId: number;
  onClose: () => void;
}

const AddUsersModal: React.FC<Props> = ({ chatId, onClose }) => {
  const allUsers = useSelector((state: RootState) => state.auth.users);
  const chat = useSelector((state: RootState) =>
    state.chat.chats.find((c) => c.chatId === chatId)
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    chat?.users.map((u) => u.id) || []
  );

  const toggleUser = (userId: number) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !selectedIds.includes(currentUser!.id)) {
      alert("Нельзя исключать себя из чата!");
      return;
    }

    try {
      await updateChatUsers(chatId, selectedIds);
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении участников:", error);
    }
  };

  return (
    <div className="add-users-modal">
      <form className="add-users-modal__form" onSubmit={handleSubmit}>
        <h2 className="add-users-modal__form-header">Участники чата #{chatId}</h2>
        <div className="user-list">
          {allUsers.map((user) => (
            <label key={user.id}>
              <input
                type="checkbox"
                checked={selectedIds.includes(user.id)}
                onChange={() => toggleUser(user.id)}
              />
              {user.name}
            </label>
          ))}
        </div>
        <div className="actions">
          <button type="submit">💾 Сохранить</button>
          <button type="button" onClick={onClose}>
            ❌ Закрыть
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsersModal;