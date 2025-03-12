import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Message } from "./entities/Message";
import AppDataSource from "./data-source";
import { Chat } from "./entities/Chat";
import { User } from "./entities/User";

export interface WebSocketServer extends Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {}

export const setupWebSocket = (server: HttpServer): WebSocketServer => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Разрешаем все источники (на проде лучше ограничить)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Пользователь подключился: ${socket.id}`);

    // Получение сообщений из чата
    socket.on("joinChat", async (chatId: number) => {
      socket.join(`chat_${chatId}`);
      console.log(`Пользователь ${socket.id} присоединился к чату ${chatId}`);
    });

    // Отправка сообщений
    socket.on("sendMessage", async ({ chatId, senderId, receiverId, content }: 
      { chatId: number; senderId: number; receiverId: number; content: string }) => {
      try {
        const chatRepo = AppDataSource.getRepository(Chat);
        const userRepo = AppDataSource.getRepository(User);
        const messageRepo = AppDataSource.getRepository(Message);

        const chat = await chatRepo.findOne({ where: { id: chatId }, relations: ["users"] });
        if (!chat) {
          console.log(`❌ Чат ${chatId} не найден`);
          return;
        }

        const sender = await userRepo.findOne({ where: { id: senderId } });
        const receiver = await userRepo.findOne({ where: { id: receiverId } });

        if (!sender || !receiver) {
          console.log("❌ Один из пользователей не найден");
          return;
        }

        const newMessage = new Message();
        newMessage.content = content;
        newMessage.chat = chat;
        newMessage.sender = sender;
        newMessage.receiver = receiver;

        await messageRepo.save(newMessage);

        io.to(`chat_${chatId}`).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Пользователь отключился: ${socket.id}`);
    });
  });

  return io;
};
