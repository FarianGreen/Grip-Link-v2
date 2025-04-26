import express, { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  deleteMessage,
  getChatMessages,
  markMessagesAsRead,
  sendMessageToChat,
  updateMessage,
} from "../controllers/MessageController";

const router: Router = express.Router();
router.get("/chats/:chatId/messages", authMiddleware, getChatMessages);
router.post("/chats/:chatId/messages", authMiddleware, sendMessageToChat);
router.patch("/chats/messages/:id", authMiddleware, updateMessage);
router.delete("/chats/messages/:id", authMiddleware, deleteMessage);
router.patch("/chats/:chatId/messages/mark-as-read", authMiddleware, markMessagesAsRead);

export default router;
