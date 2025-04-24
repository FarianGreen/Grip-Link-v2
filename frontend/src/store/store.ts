import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import authReducer from "./authSlice";
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
