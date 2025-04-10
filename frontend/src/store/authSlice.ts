import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "./store";
export interface User {
  bio: string;
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  isLogined: boolean;
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

const initialState: AuthState = {
  user: null,
  isLogined: Boolean(localStorage.getItem("accessToken")),
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  { accessToken: string; user: User },
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ accessToken: string; user: User }>(
      "http://localhost:5000/auth/register",
      credentials
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(error.response?.data?.message || "Ошибка регистрации");
  }
});

export const loginUser = createAsyncThunk<
  { accessToken: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ accessToken: string; user: User }>(
      "http://localhost:5000/auth/login",
      credentials,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(error.response?.data?.message || "Ошибка авторизации");
  }
});

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<User>("http://localhost:5000/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(error.response?.data?.message || "Ошибка загрузки пользователя");
    }
  }
);

export const refreshAccessToken = createAsyncThunk<
  { accessToken: string; user: User },
  void,
  { rejectValue: string }
>("auth/refreshAccessToken", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post<{ accessToken: string }>(
      "http://localhost:5000/auth/refresh",
      {},
      { withCredentials: true }
    );

    localStorage.setItem("accessToken", response.data.accessToken);

    const userResponse = await dispatch(fetchUser()).unwrap();
    return {
      accessToken: response.data.accessToken,
      user: userResponse,
    };
  } catch {
    return rejectWithValue("Ошибка обновления токена");
  }
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLogined = false;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
        state.loading = false;
        state.isLogined = true;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Неизвестная ошибка авторизации";
      })

      // Fetch user
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })

      // Refresh token
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
        state.isLogined = true;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isLogined = false;
        state.user = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
        state.loading = false;
        state.isLogined = true;
        state.user = action.payload.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Неизвестная ошибка регистрации";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: RootState) => state.auth;