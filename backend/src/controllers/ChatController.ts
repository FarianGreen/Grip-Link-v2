import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";

// Определяем интерфейс для расширенного Request с `user`
interface AuthRequest extends Request {
  user?: { id: number };
}

// 🔹 Создание чата (если его ещё нет)
export const createChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let { userIds }: { userIds: number[] } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    if (!Array.isArray(userIds) || userIds.length < 1) {
      res
        .status(400)
        .json({ message: "Чат должен содержать хотя бы одного пользователя" });
      return;
    }

    // Добавляем текущего пользователя, если его нет в `userIds`
    if (!userIds.includes(currentUserId)) {
      userIds.push(currentUserId);
    }

    // Получаем пользователей из базы данных
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.findByIds(userIds);

    if (users.length !== userIds.length) {
      res
        .status(404)
        .json({ message: "Один или несколько пользователей не найдены" });
      return;
    }

    // Проверяем, существует ли уже чат с таким же набором пользователей
    const chatRepo = AppDataSource.getRepository(Chat);
    const existingChat = await chatRepo
      .createQueryBuilder("chat")
      .innerJoin("chat.users", "user")
      .where("user.id IN (:...userIds)", { userIds })
      .groupBy("chat.id")
      .having("COUNT(user.id) = :count", { count: userIds.length })
      .getOne();

    if (existingChat) {
      res.json(existingChat);
      return;
    }

    // Создаём новый чат
    const newChat = chatRepo.create({ users });
    await chatRepo.save(newChat);

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Ошибка при создании чата:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// 🔹 Получение всех чатов пользователя
export const getUserChats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    const chats = await AppDataSource.getRepository(Chat).find({
      where: { users: { id: userId } },
      relations: ["users", "messages"], // Загружаем связанные данные
    });

    res.json(chats);
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
