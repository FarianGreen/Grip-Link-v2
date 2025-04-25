import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { io, sendMessageToChatWithSocket } from "../websocket";

interface AuthRequest extends Request {
  user?: { id: number; role: "user" | "admin" };
}

export const getChatMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chatId = Number(req.params.chatId);
    const userId = req.user?.id;

    if (!userId || isNaN(chatId)) {
      res.status(400).json({ message: "Некорректный запрос" });
      return;
    }

    const chat = await AppDataSource.getRepository(Chat).findOne({
      where: { chatId },
      relations: ["users"],
    });

    if (!chat || !chat.users.some((u) => u.id === userId)) {
      res.status(403).json({ message: "Доступ запрещён" });
      return;
    }

    const messages = await AppDataSource.getRepository(Message)
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.receiver", "receiver")
      .where("message.chatId = :chatId", { chatId })
      .orderBy("message.createdAt", "ASC")
      .getMany();

    const result = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
      isEdited: msg.isEdited,
      sender: msg.sender && {
        id: msg.sender.id,
        name: msg.sender.name,
        email: msg.sender.email,
        avatar: msg.sender.avatar,
      },
      receiver: msg.receiver && {
        id: msg.receiver.id,
        name: msg.receiver.name,
        email: msg.receiver.email,
        avatar: msg.receiver.avatar,
      },
    }));

    res.json(result);
  } catch (err) {
    console.error("Ошибка получения сообщений:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const sendMessageToChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chatId = Number(req.params.chatId);
    const senderId = req.user?.id;
    const { content } = req.body;

    if (!senderId || !content?.trim()) {
      res.status(400).json({ message: "Контент пустой или неавторизован" });
      return;
    }

    const chatRepo = AppDataSource.getRepository(Chat);
    const chat = await chatRepo.findOne({
      where: { chatId },
      relations: ["users"],
    });

    if (!chat || !chat.users.some((u) => u.id === senderId)) {
      res.status(403).json({ message: "Нет доступа к чату" });
      return;
    }

    const sender = await AppDataSource.getRepository(User).findOne({
      where: { id: senderId },
    });

    if (!sender) {
      res.status(404).json({ message: "Отправитель не найден" });
      return;
    }

    const newMessage = AppDataSource.getRepository(Message).create({
      content,
      sender,
      chat,
    });

    const saved = await AppDataSource.getRepository(Message).save(newMessage);
    sendMessageToChatWithSocket(chatId, saved);

    res.status(201).json(saved);
  } catch (err) {
    console.error("Ошибка отправки сообщения:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const messageId = Number(req.params.id);
    const { content } = req.body;

    if (!content?.trim()) {
      res.status(400).json({ message: "Пустой контент" });
      return;
    }

    const repo = AppDataSource.getRepository(Message);
    const message = await repo.findOne({
      where: { id: messageId },
      relations: ["sender", "chat"],
    });

    if (!message || message.sender.id !== req.user?.id) {
      res.status(403).json({ message: "Редактирование запрещено" });
      return;
    }

    message.content = content;
    message.isEdited = true;
    await repo.save(message);

    io?.to(`chat_${message.chat.chatId}`).emit("message:updated", message);
    res.json(message);
  } catch (err) {
    console.error("Ошибка при обновлении сообщения:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deleteMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const messageId = Number(req.params.id);
    const repo = AppDataSource.getRepository(Message);
    const message = await repo.findOne({
      where: { id: messageId },
      relations: ["sender", "chat"],
    });

    if (!message || message.sender.id !== req.user?.id) {
      res.status(403).json({ message: "Удаление запрещено" });
      return;
    }
    const deletedId = message.id;
    await repo.remove(message);
    console.log("📤 emitting message:deleted", { id: deletedId });
    io?.to(`chat_${message.chat.chatId}`).emit("message:deleted", {
      id: deletedId,
    });

    res.status(204).end();
  } catch (err) {
    console.error("Ошибка удаления сообщения:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
