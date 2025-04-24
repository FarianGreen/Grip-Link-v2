import express, { Router } from "express";
import {
  
  deleteMessage,
  getChatMessages,
  sendMessageToChat,
  updateMessage,
} from "../controllers/MessageController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();
router.get("/chats/:chatId/messages", authMiddleware, getChatMessages);
router.post("/chats/:chatId/messages", authMiddleware, sendMessageToChat);
router.patch("/chats/messages/:id", authMiddleware, updateMessage);
router.delete("/chats/messages/:id", authMiddleware, deleteMessage);

export default router;
