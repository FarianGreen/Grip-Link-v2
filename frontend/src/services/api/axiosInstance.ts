import store from "@/app/store";
import { logout } from "@/features/auth/authSlice";
import { refreshAccessToken } from "@/features/auth/authThunks";
import { showNotification } from "@/features/notice/notificationsSlice";
import axios, { AxiosError, AxiosRequestConfig } from "axios";


let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token!);
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // ⏳ Access token refresh
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result: any = await store.dispatch(refreshAccessToken()).unwrap();
        const newToken = result.accessToken;
        localStorage.setItem("accessToken", newToken);
        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    // 🧠 Centralized error reporting
    if (status === 403) {
      store.dispatch(showNotification({ type: "error", message: "Нет доступа" }));
    } else if (status === 404) {
      store.dispatch(showNotification({ type: "error", message: "Ресурс не найден" }));
    } else if (status === 422) {
      store.dispatch(showNotification({ type: "error", message: "Ошибка валидации" }));
    } else if (status === 500) {
      store.dispatch(showNotification({ type: "error", message: "Ошибка сервера" }));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;