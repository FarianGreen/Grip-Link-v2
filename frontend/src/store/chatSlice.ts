import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/api/axiosInstance";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Message {
  sender: User;
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
}

interface Chat {
  chatId: number;
  users: User[];
  lastMessage?: Message;
}

interface ChatState {
  chats: Chat[];
  selectedChatId: number | null;
  messages: Message[];
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
  messages: [],
};

export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Chat[]>("/chats");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Ошибка загрузки чатов");
  }
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (chatId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Message[]>(`/chats/${chatId}/messages`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Ошибка загрузки сообщений");
  }
});

export const createChat = createAsyncThunk("chats/create", async (userIds: number[], { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/chats", { userIds });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Ошибка при создании чата");
  }
});

export const deleteChat = createAsyncThunk("chats/delete", async (chatId: number, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/chats/${chatId}`);
    return chatId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Ошибка при удалении чата");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
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
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chats.push(action.payload);
      })
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<number>) => {
        state.chats = state.chats.filter(chat => chat.chatId !== action.payload);
        if (state.selectedChatId === action.payload) state.selectedChatId = null;
      });
  },
});

export const { setSelectedChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
