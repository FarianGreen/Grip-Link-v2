import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { In } from "typeorm";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const getUserChatsWithLastMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    const chatRepo = AppDataSource.getRepository(Chat);
    const chats = await chatRepo.find({
      where: { users: { id: userId } },
      relations: ["users"],
    });

    if (!chats.length) {
      res.json([]);
      return;
    }

    const chatIds = chats.map((chat) => chat.chatId);

    const lastMessages = await AppDataSource.getRepository(Message)
      .createQueryBuilder("message")
      .where("message.chatId IN (:...chatIds)", { chatIds })
      .orderBy("message.chatId", "ASC")
      .addOrderBy("message.createdAt", "DESC")
      .distinctOn(["message.chatId"])
      .getMany();

    const formattedChats = chats.map((chat) => {
      const lastMessage = lastMessages.find(
        (msg) => msg.chat?.chatId === chat.chatId
      );

      return {
        chatId: chat.chatId,
        users: chat.users?.map(({ id, name, email }) => ({ id, name, email })),
        lastMessage: lastMessage?.content || null,
        lastMessageTime: lastMessage?.createdAt || null,
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
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
      res.json(existingChat);
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
      relations: ["users", "messages"],
    });

    res.json(chats);
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
