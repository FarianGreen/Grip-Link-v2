import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { IAuthState, IUser } from "@/types";
import {
  fetchAllUsers,
  fetchUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "./authThunks";

const initialState: IAuthState = {
  user: null,
  users: [],
  isLogined: Boolean(localStorage.getItem("accessToken")),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.users = [];
      state.isLogined = false;
      state.loading = false;
      localStorage.removeItem("accessToken");
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{ accessToken: string; user: IUser }>
        ) => {
          state.loading = false;
          state.isLogined = true;
          state.user = action.payload.user;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLogined = false;
        state.users = [];
        state.error = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.isLogined = true;
        state.loading = false;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isLogined = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state,
          action: PayloadAction<{ accessToken: string; user: IUser }>
        ) => {
          state.loading = false;
          state.isLogined = true;
          state.user = action.payload.user;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.users = action.payload;
          state.loading = false;
        }
      );
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: RootState) => state.auth;
