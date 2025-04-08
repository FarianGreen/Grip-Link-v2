import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./notification.scss";
import { removeNotification } from "../../store/notificationsSlice";

export const NotificationContainer = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => dispatch(removeNotification(n.id)), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, dispatch]);

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification ${n.type || "info"}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
};
