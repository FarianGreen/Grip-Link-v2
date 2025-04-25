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
): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) res.status(401).json({ message: "Неавторизован" });

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

    const result = chats.map((chat) => {
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
        sender: last?.sender && {
          id: last.sender.id,
          name: last.sender.name,
          email: last.sender.email,
          avatar: last.sender.avatar,
        },
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Ошибка получения чатов:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateChatUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const chatId = Number(req.params.chatId);
  const { userIds } = req.body;
  const userId = req.user?.id;

  if (!userId || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ message: "Некорректные данные" });
    return;
  }

  try {
    const chatRepo = AppDataSource.getRepository(Chat);
    const userRepo = AppDataSource.getRepository(User);
    const chat = await chatRepo.findOne({
      where: { chatId },
      relations: ["users"],
    });

    if (!chat || !chat.users.some((u) => u.id === userId)) {
      res.status(403).json({ message: "Нет доступа к чату" });
      return;
    }

    const users = await userRepo.find({ where: { id: In(userIds) } });
    if (users.length !== userIds.length) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    chat.users = users;
    const updated = await chatRepo.save(chat);

    io?.to(`chat_${chatId}`).emit("chat:updated", {
      chatId: updated.chatId,
      users: updated.users.map(({ id, name, email, avatar }) => ({
        id,
        name,
        email,
        avatar,
      })),
    });

    res.json(updated);
  } catch (err) {
    console.error("Ошибка обновления участников:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

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

    if (!userIds.includes(currentUserId)) {
      userIds.push(currentUserId);
    }

    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      select: ["id", "name", "email", "avatar", "bio", "role"],
      where: { id: In(userIds) },
    });

    if (users.length !== userIds.length) {
      res
        .status(404)
        .json({ message: "Один или несколько пользователей не найдены" });
      return;
    }

    const chatRepo = AppDataSource.getRepository(Chat);
    const existingChat = await chatRepo
      .createQueryBuilder("chat")
      .innerJoin("chat.users", "user")
      .where("user.id IN (:...userIds)", { userIds })
      .groupBy("chat.chatId")
      .having("COUNT(user.id) = :count", { count: userIds.length })
      .getOne();

    if (existingChat) {
      // res.json(existingChat);
      return;
    }

    const newChat = chatRepo.create({ users });
    await chatRepo.save(newChat);

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Ошибка при создании чата:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deleteChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const chatId = Number(req.params.chatId);

  if (!req.user) {
    res.status(401).json({ message: "Неавторизован" });
    return;
  }

  try {
    const chatRepository = AppDataSource.getRepository(Chat);

    const chat = await chatRepository.findOne({
      where: { chatId: chatId },
      relations: ["users"],
    });

    if (!chat) {
      res.status(404).json({ message: "Чат не найден" });
      return;
    }

    const isParticipant = chat.users.some((user) => user.id === req.user!.id);

    if (!isParticipant) {
      res.status(403).json({ message: "Нет доступа к этому чату" });
      return;
    }

    await chatRepository.remove(chat);

    res.status(200).json({ message: "Чат удален" });
  } catch (error) {
    console.error("Ошибка при удалении чата:", error);
    res.status(500).json({ message: "Ошибка при удалении чата" });
  }
};
