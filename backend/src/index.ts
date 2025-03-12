import express, { Application } from "express";
import http from "http";
import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes";
import chatRoutes from "./routes/chatRoutes";
import cookieParser from "cookie-parser";
import AppDataSource from "./data-source";
import cors from "cors";
import { setupWebSocket } from "./websocket";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения

const app: Application = express();
const server: http.Server = http.createServer(app); // Создаём HTTP сервер

setupWebSocket(server); // Инициализируем WebSockets

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000; // Берём порт из .env или 5000

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");

    app.use("/auth", authRoutes);
    app.use("/api", chatRoutes);
    app.use("/api", messageRoutes);

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("❌ Database connection failed:", error));
