import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";

// Создание чата
export const createChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body; 
    if (userIds.length < 2) {
      res
        .status(400)
        .json({ message: "Чат должен содержать минимум двух пользователей" });
      return;
    }

    // Получаем пользователей из базы данных
    const users = await AppDataSource.getRepository(User).findByIds(userIds);
    if (users.length !== userIds.length) {
      res
        .status(404)
        .json({ message: "Один или несколько пользователей не найдены" });
      return;
    }

    // Создаём новый чат и сохраняем его
    const newChat = new Chat();
    newChat.users = users;
    await AppDataSource.getRepository(Chat).save(newChat);

    // Отправляем ответ с созданным чатом
    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка создания чата" });
  }
};
