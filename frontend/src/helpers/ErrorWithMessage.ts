import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/types";

export const extractErrorMessage = (error: unknown): string => {
  // Явно проверяем на AxiosError
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Ошибка от сервера"
    );
  }

  // Если это объект с message (например, кастомный reject)
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as any).message || "Неизвестная ошибка";
  }

  // Если строка
  if (typeof error === "string") {
    return error;
  }

  return "Произошла неизвестная ошибка";
};