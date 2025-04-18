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
import path from "path";

dotenv.config();

const app: Application = express();
const server: http.Server = http.createServer(app);

setupWebSocket(server);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");

    app.use("/api/auth", authRoutes);
    app.use("/api/", chatRoutes);
    app.use("/api", messageRoutes);

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("❌ Database connection failed:", error));
