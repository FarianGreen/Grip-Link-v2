import { configureStore } from "@reduxjs/toolkit";
import chatReducer, { addMessage } from "./chatSlice";
import authReducer from "./authSlice";
import { initSocket } from "../services/socket";
import { notificationReducer } from "./notificationsSlice";
import profileReducer from "./profileSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    notifications: notificationReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// initSocket();
const socket = initSocket();

if (socket) {
  socket.on("newMessage", (message) => {
    store.dispatch(addMessage(message));
  });
} else {
  console.error("WebSocket не инициализирован!");
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
