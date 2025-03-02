import express from "express";
import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes"
import cookieParser from "cookie-parser";
import AppDataSource from "./data-source";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");

    app.use(cookieParser());

    app.use("/auth", authRoutes);
    app.use("/messages", messageRoutes);

    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((error) => console.error("❌ Database connection failed:", error));
