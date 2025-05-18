import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axiosInstance";
import { IChat, IMessage } from "@/types";
import { extractErrorMessage } from "@/helpers/ErrorWithMessage";

export const fetchChats = createAsyncThunk<
  IChat[],
  void,
  { rejectValue: string }
>("chat/fetchChats", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IChat[]>("/chats");
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchMessages = createAsyncThunk<
  IMessage[],
  number,
  { rejectValue: string }
>("chat/fetchMessages", async (chatId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<IMessage[]>(
      `/chats/${chatId}/messages`
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const createChat = createAsyncThunk<
  IChat,
  number[],
  { rejectValue: string }
>("chats/create", async (userIds, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/chats", { userIds });
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const deleteChat = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("chats/delete", async (chatId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/chats/${chatId}`);
    return chatId;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
