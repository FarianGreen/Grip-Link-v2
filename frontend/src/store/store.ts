import { configureStore } from "@reduxjs/toolkit";
import chatReducer, { addMessage } from "./chatSlice";
import authReducer from "./authSlice";
import { connectSocket, getSocket } from "../services/socket";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

connectSocket();
const socket = getSocket();

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
