import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import axiosInstance from "../../services/api/axiosInstance";
// import "./EditMessageModal.scss";
import { updateMessage } from "../../store/chatSlice";

interface EditMessageModalProps {
  messageId: number;
  initialContent: string;
  onClose: () => void;
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({
  messageId,
  initialContent,
  onClose,
}) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Сообщение не может быть пустым");
      return;
    }
    try {
      const response = await axiosInstance.patch(`/chats/messages/${messageId}`, {
        content,
      });
      dispatch(updateMessage(response.data));
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при обновлении");
    }
  };

  return (
    <div className="edit-modal">
      <h2>Редактировать сообщение</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />
        {error && <p className="edit-error">{error}</p>}
        <div className="edit-actions">
          <button type="submit" className="save-btn">
            Сохранить
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMessageModal;
