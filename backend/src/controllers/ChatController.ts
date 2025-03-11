import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { Message } from "../entities/Message";


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

    const chats = await AppDataSource.getRepository(Chat)
      .createQueryBuilder("chat")
      .innerJoinAndSelect("chat.users", "user")
      .leftJoinAndSelect(
        (qb) =>
          qb
            .select("m.chatId", "chatId")
            .addSelect("m.content", "lastMessage")
            .addSelect("m.createdAt", "lastMessageTime")
            .from(Message, "m")
            .where("m.chatId = chat.id")
            .orderBy("m.createdAt", "DESC")
            .limit(1),
        "lastMessage",
        "lastMessage.chatId = chat.id"
      )
      .where("user.id = :userId", { userId })
      .getMany();

    const formattedChats = chats.map((chat) => ({
      chatId: chat.id,
      users: chat.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
      lastMessage: chat.messages.length > 0 ? chat.messages[0].content : null,
      lastMessageTime:
        chat.messages.length > 0 ? chat.messages[0].createdAt : null,
    }));

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
    const users = await userRepo.findByIds(userIds);

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
      .groupBy("chat.id")
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
