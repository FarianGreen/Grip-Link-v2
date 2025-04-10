import { AxiosResponse, AxiosError } from "axios";
import { AppDispatch } from "../store";
import { refreshAccessToken } from "../authSlice";

export const axiosWithToken = async <T>(
  dispatch: AppDispatch,
  request: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await request();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    if (error.response?.status === 401) {
      const refreshResult = await dispatch(refreshAccessToken());

      if (refreshResult.meta.requestStatus !== "fulfilled") {
        throw new Error("Ошибка обновления токена");
      }

      const retryResponse = await request();
      return retryResponse.data;
    }

    const message =
      error.response?.data?.message || error.message || "Неизвестная ошибка";
    throw new Error(message);
  }
};
