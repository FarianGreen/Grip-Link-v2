import axiosInstance from "@/services/api/axiosInstance";
import { showNotification } from "@/features/notice/notificationsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import { extractErrorMessage } from "@/helpers/ErrorWithMessage";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    credentials: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/register", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      localStorage.setItem("accessToken", response.data.accessToken);
      dispatch(showNotification({ message: "✅ Вы вошли!", type: "success" }));
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");
      dispatch(logout());
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh",
        {},
        { withCredentials: true }
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      return { accessToken: response.data.accessToken };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
