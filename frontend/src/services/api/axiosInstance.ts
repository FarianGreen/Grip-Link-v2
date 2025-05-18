import axios, { AxiosError, AxiosRequestConfig } from "axios";
import store from "@/app/store";
import { logout, resetAuthState } from "@/features/auth/authSlice";
import { refreshAccessToken } from "@/features/auth/authThunks";
import { showNotification } from "@/features/notice/notificationsSlice";

// Глобальные переменные
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

// Очередь повторных запросов при обновлении токена
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Создание axios-инстанса
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Интерцептор запроса: вставляем токен
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор ответа
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Только если 401 и ещё не пробовали повторить
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              } else {
                originalRequest.headers = { Authorization: `Bearer ${token}` };
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

  const newToken = (actionResult.payload as { accessToken: string }).accessToken;

  localStorage.setItem("accessToken", newToken);
  processQueue(null, newToken);
  isRefreshing = false;

  if (originalRequest.headers) {
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
  } else {
    originalRequest.headers = { Authorization: `Bearer ${newToken}` };
  }

  return axiosInstance(originalRequest);
} catch (refreshError: any) {
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

    // Обработка общих ошибок
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

    // Всегда пробрасываем ошибку дальше
    return Promise.reject(error);
  }
);

export default axiosInstance;