import express, { Router } from "express";
import {
  getChatMessages,
  sendMessageToChat,
  updateMessage,
} from "../controllers/MessageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();
router.get("/chats/:chatId/messages", authMiddleware, getChatMessages);
router.post("/chats/:chatId/messages", authMiddleware, sendMessageToChat);
router.patch("/chats/messages/:id", authMiddleware, updateMessage);

export default router;
