import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotificationType = "success" | "error" | "info";

interface NotificationState {
  message: string | null;
  type: NotificationType | null;
}

const initialState: NotificationState = {
  message: null,
  type: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type?: NotificationType }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
    },
    clearNotification: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
