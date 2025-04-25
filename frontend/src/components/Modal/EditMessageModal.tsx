import { useState } from "react";
import { editMessageInChat } from "../../store/chatSlice";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Сообщение не может быть пустым");
      return;
    }
    try {
      await editMessageInChat(messageId, content);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при обновлении");
    }
  };

  return (
    <form className="modal-content__form" onSubmit={handleSubmit}>
      <h2 className="modal-content__title">Редактировать сообщение</h2>
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="form-textarea"
        />
        {error && <p className="form-error">{error}</p>}
      </div>
      <div className="form-actions">
        <button type="submit" className="save-btn">
          Сохранить
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default EditMessageModal;
