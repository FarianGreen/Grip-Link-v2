import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axiosInstance";
import { RootState } from "./store";
import { IProfileState, IUser } from "@/types";

const initialState: IProfileState = {
  user: null,
  loading: false,
  error: null,
};

export const updateProfile = createAsyncThunk("profile/update", async (data: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/auth/profile/avatar", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Ошибка при обновлении профиля");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
export const selectProfile = (state: RootState) => state.profile;