import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/api/axiosInstance";
import { IChat, IChatState, IMessage } from "@/types";

const initialState: IChatState = {
  chats: [],
  selectedChatId: null,
  messages: [],
};

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<IChat[]>("/chats");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки чатов"
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<IMessage[]>(
        `/chats/${chatId}/messages`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки сообщений"
      );
    }
  }
);

export const createChat = createAsyncThunk(
  "chats/create",
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/chats", { userIds });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при создании чата"
      );
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chats/delete",
  async (chatId: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/chats/${chatId}`);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при удалении чата"
      );
    }
  }
);

export const updateChatUsers = (chatId: number, userIds: number[]) => {
  return axiosInstance.patch(`/chats/${chatId}/users`, { userIds });
};

export const editMessageInChat = (messageId: number, content: string) => {
  return axiosInstance.patch(`/chats/messages/${messageId}`, {
    content,
  });
};

export const deleteMessageInChat = async (messageId: number) => {
  return await axiosInstance.delete(`/chats/messages/${messageId}`);
};

export const markMessagesRead = (chatId: number, messageIds: number[]) => {
  return axiosInstance.patch(`/chats/${chatId}/messages/mark-as-read`, {
    messageIds,
  });
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
