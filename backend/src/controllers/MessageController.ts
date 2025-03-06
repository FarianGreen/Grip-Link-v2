import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";

interface AuthRequest extends Request {
  user?: { id: number }; // Добавляем типизацию для пользователя
}

const messageRepository = AppDataSource.getRepository(Message);

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
  const { userId } = req.body;
  const messages = await messageRepository.find({
    where: [{ sender: userId }, { receiver: userId }],
  });
  res.json(messages);
};