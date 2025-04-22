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

  if (!userId) {
    res.status(401).json({ message: "Пользователь не авторизован" });
    return;
  }

  try {
    // 1. Получаем все чаты пользователя (включая всех участников)
    const chats = await AppDataSource.getRepository(Chat)
      .createQueryBuilder("chat")
      .innerJoin("chat.users", "user") // текущий пользователь
      .leftJoinAndSelect("chat.users", "allUsers") // все пользователи чата
      .where("user.id = :userId", { userId })
      .getMany();

    if (!chats.length) {
      res.json([]);
      return;
    }

    // 2. Получаем последние сообщения по каждому чату
    const subQuery = AppDataSource.getRepository(Message)
      .createQueryBuilder("sub")
      .select("DISTINCT ON (sub.chatId) sub.id", "id")
      .addSelect("sub.chatId", "chatId")
      .orderBy("sub.chatId")
      .addOrderBy("sub.createdAt", "DESC");

    const lastMessagesRaw = await AppDataSource.getRepository(Message)
      .createQueryBuilder("message")
      .innerJoin(
        "(" + subQuery.getQuery() + ")",
        "latest",
        "message.id = latest.id"
      )
      .leftJoinAndSelect("message.sender", "sender")
      .setParameters(subQuery.getParameters())
      .getMany();

    // 3. Собираем данные
    const formattedChats = chats.map((chat) => {
      const lastMessage = lastMessagesRaw.find(
        (msg) => msg.chat?.chatId === chat.chatId
      );

      return {
        chatId: chat.chatId,
        users: chat.users.map(({ id, name, email, avatar }) => ({
          id,
          name,
          email,
          avatar,
        })),
        lastMessage: lastMessage?.content || null,
        lastMessageTime: lastMessage?.createdAt || null,
        sender: lastMessage?.sender || null,
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

export const updateChatUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Неавторизован" });
    return;
  }

  const chatId = parseInt(req.params.chatId);
  const { userIds } = req.body;

  if (isNaN(chatId)) {
    res.status(400).json({ message: "Неверный chatId" });
    return;
  }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ message: "userIds должен быть массивом" });
    return;
  }

  try {
    const chatRepo = AppDataSource.getRepository(Chat);
    const userRepo = AppDataSource.getRepository(User);

    const chat = await chatRepo.findOne({
      where: { chatId },
      relations: ["users"],
    });

    if (!chat) {
      res.status(404).json({ message: "Чат не найден" });
      return;
    }

    // 🔐 Проверка: только участник может менять чат
    const isParticipant = chat.users.some((u) => u.id === req.user!.id);
    if (!isParticipant) {
      res.status(403).json({ message: "Вы не участник этого чата" });
      return;
    }

    const users = await userRepo.find({ where: { id: In(userIds) } });

    if (users.length !== userIds.length) {
      res.status(404).json({ message: "Некоторые пользователи не найдены" });
      return;
    }

    chat.users = users;
    const updatedChat = await chatRepo.save(chat);

    io?.to(String(chatId)).emit("chat:updated", updatedChat);
    res.json(updatedChat);
  } catch (error) {
    console.error("Ошибка при обновлении участников чата:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
