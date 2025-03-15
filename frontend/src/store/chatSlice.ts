import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { refreshAccessToken } from "./authSlice";

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

export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.get<Chat[]>("http://localhost:5000/api/chats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await dispatch(refreshAccessToken());
      return rejectWithValue("Токен обновлен, попробуйте снова.");
    }
    return rejectWithValue(error.response?.data?.message || "Ошибка загрузки чатов");
  }
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (chatId: number, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.get<Message[]>(`http://localhost:5000/api/chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await dispatch(refreshAccessToken());
      return rejectWithValue("Токен обновлен, попробуйте снова.");
    }
    return rejectWithValue(error.response?.data?.message || "Ошибка загрузки сообщений");
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
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const { setSelectedChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
