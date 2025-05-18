import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat, IChatState, IMessage } from "@/types";
import { createChat, deleteChat, fetchChats, fetchMessages } from "./chatThunks";

const initialState: IChatState = {
  chats: [],
  selectedChatId: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    updateChat: (state, action: PayloadAction<IChat>) => {
      const updated = action.payload;
      const index = state.chats.findIndex(
        (chat) => chat.chatId === updated.chatId
      );

      if (index !== -1) {
        state.chats[index] = {
          ...state.chats[index],
          ...updated,
          users: updated.users,
        };
      } else {
        state.chats.push(updated);
      }
    },
    updateMessage: (state, action: PayloadAction<IMessage>) => {
      const index = state.messages.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) state.messages[index] = action.payload;
    },
    messageDelete: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    markMessagesAsRead: (
      state,
      { payload }: PayloadAction<{ userId: number; messageIds: number[] }>
    ) => {
      for (const msg of state.messages) {
        if (payload.messageIds.includes(msg.id)) {
          if (!msg.readBy) msg.readBy = [];
          if (!msg.readBy.some((u) => u.id === payload.userId)) {
            msg.readBy.push({ id: payload.userId });
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<IChat>) => {
        state.chats.push(action.payload);
      })
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<number>) => {
        state.chats = state.chats.filter(
          (chat) => chat.chatId !== action.payload
        );
        if (state.selectedChatId === action.payload)
          state.selectedChatId = null;
      });
  },
});

export const {
  setSelectedChat,
  addMessage,
  updateChat,
  updateMessage,
  messageDelete,
  markMessagesAsRead
} = chatSlice.actions;
export default chatSlice.reducer;
