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
    const chatId = parseInt(req.params.chatId);
    const userId = req.user?.id;

    if (isNaN(chatId)) {
      res.status(400).json({ message: "Некорректный chatId" });
      return;
    }

    const chat = await AppDataSource.getRepository(Chat).findOne({
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

    const cleanedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
      isEdited: msg.isEdited,
      sender: msg.sender
        ? {
            id: msg.sender.id,
            name: msg.sender.name,
            email: msg.sender.email,
            avatar: msg.sender.avatar,
          }
        : null,
      receiver: msg.receiver
        ? {
            id: msg.receiver.id,
            name: msg.receiver.name,
            email: msg.receiver.email,
            avatar: msg.receiver.avatar,
          }
        : null,
    }));

    res.json(cleanedMessages);
  } catch (err) {
    console.error("Ошибка при получении сообщений чата:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const sendMessageToChat = async (req: AuthRequest, res: Response) => {
  const chatId = +req.params.chatId;
  const senderId = req.user?.id;
  const { content } = req.body;

  if (!content || !senderId)
    return res.status(400).json({ message: "Контент отсутствует или неавторизован" });

  try {
    const chatRepo = AppDataSource.getRepository(Chat);
    const chat = await chatRepo.findOne({ where: { chatId }, relations: ["users"] });
    if (!chat) return res.status(404).json({ message: "Чат не найден" });

    const isParticipant = chat.users.some((u) => u.id === senderId);
    if (!isParticipant) return res.status(403).json({ message: "Вы не участник чата" });

    const sender = await AppDataSource.getRepository(User).findOne({ where: { id: senderId } });
    if (!sender) return res.status(404).json({ message: "Пользователь не найден" });

    const message = AppDataSource.getRepository(Message).create({
      content,
      chat,
      sender,
    });

    const saved = await AppDataSource.getRepository(Message).save(message);
    sendMessageToChatWithSocket(chatId, saved);

    res.status(201).json(saved);
  } catch (err) {
    console.error("Ошибка при отправке сообщения:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateMessage = async (req: AuthRequest, res: Response) => {
  const id = +req.params.id;
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Пустой контент" });

  try {
    const repo = AppDataSource.getRepository(Message);
    const message = await repo.findOne({ where: { id }, relations: ["sender", "chat"] });
    if (!message) return res.status(404).json({ message: "Сообщение не найдено" });

    if (message.sender.id !== req.user?.id)
      return res.status(403).json({ message: "Нет прав на редактирование" });

    message.content = content;
    message.isEdited = true;

    await repo.save(message);
    io?.to(`chat_${message.chat.chatId}`).emit("message:updated", message);

    res.json(message);
  } catch (err) {
    console.error("Ошибка редактирования:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  const id = +req.params.id;
  try {
    const repo = AppDataSource.getRepository(Message);
    const message = await repo.findOne({ where: { id }, relations: ["sender", "chat"] });
    if (!message) return res.status(404).json({ message: "Сообщение не найдено" });

    if (message.sender.id !== req.user?.id)
      return res.status(403).json({ message: "Нет прав на удаление" });

    await repo.remove(message);
    io?.to(`chat_${message.chat.chatId}`).emit("message:deleted", { id });

    res.status(204).end();
  } catch (err) {
    console.error("Ошибка при удалении сообщения:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};