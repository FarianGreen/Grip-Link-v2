import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import "./modal.scss";
import { updateChat, updateChatUsers } from "../../store/chatSlice";

interface Props {
  chatId: number;
  onClose: () => void;
}

const AddUsersModal: React.FC<Props> = ({ chatId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
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
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
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
      // dispatch(updateChat(response.data));
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении участников:", error);
    }
  };

  return (
    <form className="modal-content__form" onSubmit={handleSubmit}>
      <h2 className="modal-content__title">Участники чата #{chatId}</h2>
      <div className="form-group user-list">
        {allUsers.map((user) => (
          <label className="form-group__label" key={user.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(user.id)}
              onChange={() => toggleUser(user.id)}
            />
            {user.name}
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="save-btn">
          💾 Сохранить
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          ❌ Закрыть
        </button>
      </div>
    </form>
  );
};

export default AddUsersModal;
