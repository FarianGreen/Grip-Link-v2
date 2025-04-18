import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./notification.scss";
import { clearNotification } from "../../store/notificationsSlice";

export const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearNotification()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="notification-container">
      <div className={`notification ${type || "info"}`}>
        <span>{message}</span>
        <button onClick={() => dispatch(clearNotification())}>×</button>
      </div>
    </div>
  );
};
