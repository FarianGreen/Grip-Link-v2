import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "user" | "admin";
  };
}

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { content, chatId, receiverId } = req.body;
  const senderId = req.user?.id; // Используем ID из токена пользователя

  if (!senderId) {
    res.status(401).json({ message: "Пользователь не авторизован" });
    return;
  }

  // Проверяем существование чата
  const chat = await AppDataSource.getRepository(Chat).findOne({
    where: { id: chatId },
    relations: ["users"], // Загружаем пользователей, чтобы проверить принадлежность
  });

  if (!chat) {
    res.status(404).json({ message: "Чат не найден" });
    return;
  }

  const sender = await AppDataSource.getRepository(User).findOne({
    where: { id: senderId },
  });
  const receiver = await AppDataSource.getRepository(User).findOne({
    where: { id: receiverId },
  });

  if (!sender || !receiver) {
    res.status(404).json({ message: "Пользователь не найден" });
    return;
  }

  // Проверка, что оба пользователя находятся в чате
  if (
    !chat.users.some((user) => user.id === senderId) ||
    !chat.users.some((user) => user.id === receiverId)
  ) {
    res.status(403).json({ message: "Пользователи не находятся в этом чате" });
    return;
  }

  // Создаём новое сообщение
  const newMessage = new Message();
  newMessage.content = content;
  newMessage.chat = chat;
  newMessage.sender = sender;
  newMessage.receiver = receiver;

  await AppDataSource.getRepository(Message).save(newMessage);

  res.status(201).json(newMessage);
};

export const getMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { chatId } = req.params;

  try {
    const chat = await AppDataSource.getRepository(Chat).findOne({
      where: { id: Number(chatId) },
      relations: ["messages", "users"],
    });

    if (!chat) {
      res.status(404).json({ message: "Чат не найден" });
      return;
    }

    // Возвращаем все сообщения в чате
    const messages = chat.messages;
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении сообщений" });
  }
};

export const getChatMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const userId = req.user?.id;

    if (isNaN(chatId)) {
      res.status(400).json({ message: "Некорректный chatId" });
      return;
    }

    const chatRepository = AppDataSource.getRepository(Chat);
    const chat = await chatRepository.findOne({
      where: { id: chatId },
      relations: ["users"],
    });

    if (!chat) {
      res.status(404).json({ message: "Чат не найден" });
      return;
    }

    // Проверяем, состоит ли пользователь в этом чате
    const isMember = chat.users.some((user) => user.id === userId);
    if (!isMember) {
      res.status(403).json({ message: "Нет доступа к этому чату" });
      return;
    }

    // Получаем сообщения из чата
    const messages = await AppDataSource.getRepository(Message).find({
      where: { chat: { id: chatId } },
      relations: ["sender", "receiver"],
      order: { createdAt: "ASC" },
    });

    res.json(messages);
  } catch (error) {
    console.error("Ошибка при получении сообщений чата:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
