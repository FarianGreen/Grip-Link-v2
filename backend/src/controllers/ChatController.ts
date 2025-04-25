// src/controllers/chatController.ts

import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { In } from "typeorm";
import { io } from "../websocket";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const getUserChatsWithLastMessages = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Неавторизован" });

  try {
    const chats = await AppDataSource.getRepository(Chat)
      .createQueryBuilder("chat")
      .innerJoin("chat.users", "user", "user.id = :userId", { userId })
      .leftJoinAndSelect("chat.users", "allUsers")
      .getMany();

    const subQuery = AppDataSource.getRepository(Message)
      .createQueryBuilder("sub")
      .select("DISTINCT ON (sub.chatId) sub.id", "id")
      .addSelect("sub.chatId", "chatId")
      .orderBy("sub.chatId")
      .addOrderBy("sub.createdAt", "DESC");

    const lastMessages = await AppDataSource.getRepository(Message)
      .createQueryBuilder("message")
      .innerJoin(
        "(" + subQuery.getQuery() + ")",
        "latest",
        "message.id = latest.id"
      )
      .leftJoinAndSelect("message.sender", "sender")
      .setParameters(subQuery.getParameters())
      .getMany();

    const formatted = chats.map((chat) => {
      const last = lastMessages.find((m) => m.chat?.chatId === chat.chatId);
      return {
        chatId: chat.chatId,
        users: chat.users.map(({ id, name, email, avatar }) => ({
          id,
          name,
          email,
          avatar,
        })),
        lastMessage: last?.content || null,
        lastMessageTime: last?.createdAt || null,
        sender: last?.sender
          ? {
              id: last.sender.id,
              name: last.sender.name,
              email: last.sender.email,
              avatar: last.sender.avatar,
              bio: last.sender.bio,
            }
          : null,
      };
    });

    res.json(formatted);
  } catch (e) {
    console.error("Ошибка при получении чатов:", e);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateChatUsers = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Неавторизован" });

  const chatId = +req.params.chatId;
  const { userIds } = req.body;
  if (!Array.isArray(userIds) || userIds.length === 0)
    return res.status(400).json({ message: "userIds должен быть массивом" });

  try {
    const chatRepo = AppDataSource.getRepository(Chat);
    const userRepo = AppDataSource.getRepository(User);
    const chat = await chatRepo.findOne({
      where: { chatId },
      relations: ["users"],
    });
    if (!chat) return res.status(404).json({ message: "Чат не найден" });

    const isParticipant = chat.users.some((u) => u.id === req.user!.id);
    if (!isParticipant) return res.status(403).json({ message: "Нет прав" });

    const users = await userRepo.find({ where: { id: In(userIds) } });
    if (users.length !== userIds.length)
      return res.status(404).json({ message: "Пользователь не найден" });

    chat.users = users;
    const updated = await chatRepo.save(chat);

    io?.to(`chat_${chatId}`).emit("chat:updated", {
      chatId: updated.chatId,
      users: updated.users.map(({ id, name, email, avatar, bio }) => ({
        id,
        name,
        email,
        avatar,
        bio,
      })),
    });

    res.json(updated);
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
