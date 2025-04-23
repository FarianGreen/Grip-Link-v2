import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import AppDataSource from "./data-source";
import { Message } from "./entities/Message";
import { Chat } from "./entities/Chat";
import { User } from "./entities/User";

// 🏷️ Интерфейс данных для отправки сообщений
interface SendMessagePayload {
  chatId: number;
  senderId: number;
  content: string;
  receiverId?: number;
}

interface MarkAsReadPayload {
  chatId: number;
  userId: number;
}

export let io: Server | null = null;

export const setupWebSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Socket подключен: ${socket.id}`);

    socket.on("joinChat", (chatId: number) => {
      socket.join(`chat_${chatId}`);
      console.log(
        `👥 Пользователь ${socket.id} присоединился к чату ${chatId}`
      );
    });

    socket.on("sendMessage", async (data: SendMessagePayload) => {
      const { chatId, senderId, receiverId, content } = data;
      try {
        const chatRepo = AppDataSource.getRepository(Chat);
        const userRepo = AppDataSource.getRepository(User);
        const messageRepo = AppDataSource.getRepository(Message);

        const [chat, sender] = await Promise.all([
          chatRepo.findOne({ where: { chatId }, relations: ["users"] }),
          userRepo.findOne({ where: { id: senderId } }),
        ]);

        if (!chat || !sender) {
          console.warn("❌ Неверный чат или отправитель");
          return;
        }

        let receiver: User | null = null;

        if (receiverId) {
          receiver = await userRepo.findOne({ where: { id: receiverId } });
        } else {
          console.warn("❌ Получатель не найден");
        }

        const message = messageRepo.create({
          content,
          chat,
          sender,
          ...(receiver ? { receiver } : {}),
        });

        await messageRepo.save(message);

        io?.to(`chat_${chatId}`).emit("receiveMessage", message);
      } catch (error) {
        console.error("❌ Ошибка при отправке сообщения:", error);
      }
    });

    socket.on("markAsRead", async ({ chatId, userId }: MarkAsReadPayload) => {
      try {
        const repo = AppDataSource.getRepository(Message);
        const result = await repo.update(
          {
            chat: { chatId },
            receiver: { id: userId },
            isRead: false,
          },
          { isRead: true }
        );

        if (result.affected && result.affected > 0) {
          console.log(
            `📩 ${result.affected} сообщений помечено прочитанными в чате ${chatId} для пользователя ${userId}`
          );
        }
      } catch (err) {
        console.error("❌ Ошибка при обновлении isRead:", err);
      }
    });
    

    socket.on("disconnect", () => {
      console.log(`🔌 Socket отключён: ${socket.id}`);
    });
  });
};

export const sendMessageToChatWithSocket = (
  chatId: number,
  message: Message
): void => {
  if (!io) {
    console.error("❌ WebSocket не инициализирован");
    return;
  }

  io.to(`chat_${chatId}`).emit("newMessage", message);
};
