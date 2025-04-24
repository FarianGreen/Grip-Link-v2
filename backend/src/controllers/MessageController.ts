import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { io, sendMessageToChatWithSocket } from "../websocket";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "user" | "admin";
  };
}

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
      where: { chatId },
      relations: ["users"],
    });

    if (!chat) {
      res.status(404).json({ message: "Чат не найден" });
      return;
    }

    const isMember = chat.users.some((user) => user.id === userId);
    if (!isMember) {
      res.status(403).json({ message: "Нет доступа к этому чату" });
      return;
    }

    const messages = await AppDataSource.getRepository(Message)
      .createQueryBuilder("message")
      .leftJoin("message.sender", "sender")
      .leftJoin("message.receiver", "receiver")
      .addSelect([
        "sender.id",
        "sender.name",
        "sender.email",
        "sender.avatar",
        "receiver.id",
        "receiver.name",
        "receiver.email",
        "receiver.avatar",
      ])
      .where("message.chatId = :chatId", { chatId })
      .orderBy("message.createdAt", "ASC")
      .getMany();

    res.json(messages);
  } catch (error) {
    console.error("Ошибка при получении сообщений чата:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const sendMessageToChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const senderId = req.user?.id;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Сообщение не может быть пустым" });
      return;
    }

    const chatRepository = AppDataSource.getRepository(Chat);
    const chat = await chatRepository.findOne({
      where: { chatId: chatId },
      relations: ["users"],
    });

    if (!chat) {
      res.status(404).json({ message: "Чат не найден" });
      return;
    }

    // Проверяем, является ли отправитель участником чата
    const isMember = chat.users.some((user) => user.id === senderId);
    if (!isMember) {
      res.status(403).json({ message: "Вы не состоите в этом чате" });
      return;
    }

    // Создаём сообщение
    const sender = await AppDataSource.getRepository(User).findOne({
      where: { id: senderId },
    });

    if (!sender) {
      res.status(404).json({ message: "Отправитель не найден" });
      return;
    }

    const newMessage = new Message();
    newMessage.content = content;
    newMessage.sender = sender;
    newMessage.chat = chat;

    await AppDataSource.getRepository(Message).save(newMessage);

    sendMessageToChatWithSocket(chatId, newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;

  if (io == null) return;
  if (!content?.trim()) {
    res.status(400).json({ message: "Контент не может быть пустым" });
    return;
  }

  const messageRepo = AppDataSource.getRepository(Message);
  const message = await messageRepo.findOne({
    where: { id: +id },
    relations: ["sender", "chat"],
  });

  if (!message) {
    res.status(404).json({ message: "Сообщение не найдено" });
    return;
  }

  // Только отправитель может редактировать
  if (message.sender.id !== req.user?.id) {
    res.status(403).json({ message: "Нет прав на редактирование" });
    return;
  }

  message.content = content;
  message.isEdited = true;

  await messageRepo.save(message);
  io.to(String(message.chat.chatId)).emit("message:updated", message);

  res.json(message);
};
export const deleteMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (io == null) return;
  const messageRepo = AppDataSource.getRepository(Message);
  const message = await messageRepo.findOne({
    where: { id: +id },
    relations: ["sender", "chat"],
  });

  if (!message) {
    res.status(404).json({ message: "Сообщение не найдено" });
    return;
  }

  if (message.sender.id !== req.user?.id) {
    res.status(403).json({ message: "Нет прав на удаление" });
    return;
  }

  await messageRepo.remove(message);
  io.to(String(message.chat.chatId)).emit("message:deleted", {
    id: message.id,
  });

  res.status(204).end();
};
