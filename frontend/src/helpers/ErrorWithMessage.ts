import { ErrorResponse } from "@/types";

export const extractErrorMessage = (error: unknown): string => {
  const err = error as { response?: { data?: ErrorResponse } };
  return err.response?.data?.message || "Произошла неизвестная ошибка";
};