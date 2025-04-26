import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import AppDataSource from "./data-source";
import { Chat } from "./entities/Chat";
import { Message } from "./entities/Message";
import { User } from "./entities/User";

export let io: Server | null = null;

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

export const setupWebSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Socket подключен: ${socket.id}`);

    // Join chat room
    socket.on("joinChat", (chatId: number) => {
      socket.join(getChatRoom(chatId));
      console.log(`👥 ${socket.id} присоединился к чату #${chatId}`);
    });

    // Incoming message
    socket.on("sendMessage", async (data: SendMessagePayload) => {
      try {
        const message = await handleCreateMessage(data);
        if (!message) return;

        emitToChat(data.chatId, "receiveMessage", message);
      } catch (err) {
        console.error("❌ Ошибка sendMessage:", err);
      }
    });
  });
};

// 🌐 Вспомогательные

const getChatRoom = (chatId: number) => `chat_${chatId}`;

const emitToChat = (chatId: number, event: string, payload: any) => {
  if (!io) return;
  io.to(getChatRoom(chatId)).emit(event, payload);
};

const handleCreateMessage = async ({
  chatId,
  senderId,
  receiverId,
  content,
}: SendMessagePayload): Promise<Message | null> => {
  const chatRepo = AppDataSource.getRepository(Chat);
  const userRepo = AppDataSource.getRepository(User);
  const msgRepo = AppDataSource.getRepository(Message);

  const [chat, sender] = await Promise.all([
    chatRepo.findOne({ where: { chatId }, relations: ["users"] }),
    userRepo.findOne({ where: { id: senderId } }),
  ]);

  if (!chat || !sender) {
    console.warn("❌ Чат или отправитель не найден");
    return null;
  }

  const receiver = receiverId
    ? await userRepo.findOne({ where: { id: receiverId } })
    : null;

  const message = msgRepo.create({
    content,
    chat,
    sender,
    ...(receiver ? { receiver } : {}),
  });

  return msgRepo.save(message);
};

// 🧠 Экспорт отправки снаружи
export const sendMessageToChatWithSocket = (
  chatId: number,
  message: Message
): void => {
  emitToChat(chatId, "newMessage", message);
};
