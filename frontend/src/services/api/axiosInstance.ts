import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import store from "@/app/store";
import { logout, resetAuthState } from "@/features/auth/authSlice";
import { refreshAccessToken } from "@/features/auth/authThunks";
import { showNotification } from "@/features/notice/notificationsSlice";

// Тип для расширенного запроса с признаком повторной попытки
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Результат успешного refreshAccessToken
interface RefreshPayload {
  accessToken: string;
}

// Очередь неудачных запросов
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Обработка очереди
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Инстанс axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Добавляем токен в заголовки
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ответа
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const actionResult = await store.dispatch(refreshAccessToken());

        if (refreshAccessToken.rejected.match(actionResult)) {
          throw actionResult.payload || new Error("Ошибка обновления токена");
        }

        const { accessToken } = actionResult.payload as RefreshPayload;

        localStorage.setItem("accessToken", accessToken);
        processQueue(null, accessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        isRefreshing = false;

        store.dispatch(logout());
        store.dispatch(resetAuthState());

        if (axios.isAxiosError(refreshError)) {
          return Promise.reject(refreshError);
        }

        const fallbackError = new axios.AxiosError(
          "Ошибка обновления токена",
          "TOKEN_REFRESH_FAILED",
          originalRequest,
          null,
          {
            status: 401,
            data: { message: "Ошибка обновления токена" },
            statusText: "Unauthorized",
            headers: {},
            config: originalRequest,
          }
        );

        return Promise.reject(fallbackError);
      }
    }

    // Централизованная обработка ошибок
    switch (status) {
      case 403:
        store.dispatch(showNotification({ type: "error", message: "Нет доступа" }));
        break;
      case 404:
        store.dispatch(showNotification({ type: "error", message: "Ресурс не найден" }));
        break;
      case 422:
        store.dispatch(showNotification({ type: "error", message: "Ошибка валидации" }));
        break;
      case 500:
        store.dispatch(showNotification({ type: "error", message: "Ошибка сервера" }));
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;