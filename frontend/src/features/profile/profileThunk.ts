import { extractErrorMessage } from "@/helpers/ErrorWithMessage";
import axiosInstance from "@/services/api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/profile/avatar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);
