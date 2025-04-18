import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const updateAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user?.id;

  if (!userId) {
    res.status(401).json({ message: "Неавторизован" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: "Файл не был загружен" });
    return;
  }

  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    user.avatar = req.file.filename;
    await userRepository.save(user);

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error("Ошибка при обновлении аватара:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
