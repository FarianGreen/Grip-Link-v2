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
  receiverId?: number; // 🟢 Необязательный получатель
}

// WebSocket-сервер
let io: Server | null = null;

/**
 * 📌 Инициализация WebSocket-сервера
 */
export const setupWebSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Пользователь подключился: ${socket.id}`);

    // 📌 Подключение к чату
    socket.on("joinChat", (chatId: number) => {
      socket.join(`chat_${chatId}`);
      console.log(`👥 Пользователь ${socket.id} присоединился к чату ${chatId}`);
    });

    // 📌 Отправка сообщений
    socket.on("sendMessage", async (data: SendMessagePayload) => {
      const { chatId, senderId, receiverId, content } = data;

      try {
        const chatRepo = AppDataSource.getRepository(Chat);
        const userRepo = AppDataSource.getRepository(User);
        const messageRepo = AppDataSource.getRepository(Message);

        const chat = await chatRepo.findOne({ where: { chatId: chatId }, relations: ["users"] });
        if (!chat) {
          console.log(`❌ Чат ${chatId} не найден`);
          return;
        }

        const sender = await userRepo.findOne({ where: { id: senderId } });
        if (!sender) {
          console.log("❌ Отправитель не найден");
          return;
        }

        let receiver: User | null = null;
        if (receiverId) {
          receiver = await userRepo.findOne({ where: { id: receiverId } });
          if (!receiver) {
            console.log("❌ Получатель не найден");
            return;
          }
        }

        const newMessage = new Message();
        newMessage.content = content;
        newMessage.chat = chat;
        newMessage.sender = sender;
        if (receiver) newMessage.receiver = receiver;

        await messageRepo.save(newMessage);

        // 📌 Рассылаем сообщение всем участникам чата
        io?.to(`chat_${chatId}`).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("❌ Ошибка при отправке сообщения:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Пользователь отключился: ${socket.id}`);
    });
  });
};

/**
 * 📌 Функция отправки сообщений через WebSocket
 */
export const sendMessageToChatWithSocket = (chatId: number, message: Message): void => {
  if (!io) {
    console.error("❌ WebSocket сервер не инициализирован!");
    return;
  }
  io.to(`chat_${chatId}`).emit("newMessage", message);
};
