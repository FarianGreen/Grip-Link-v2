import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");

    app.use("/auth", authRoutes); // Подключаем маршруты авторизации

    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((error) => console.error("❌ Database connection failed:", error));
