import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя слишком короткое"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;