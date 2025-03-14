import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Message {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
}

interface Chat {
    id: number;
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


export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
    const response = await axios.get<Chat[]>("/api/chats");
    return response.data;
});

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId: number) => {
        const response = await axios.get<Message[]>(`/api/messages/${chatId}`);
        return response.data;
    }
);

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
