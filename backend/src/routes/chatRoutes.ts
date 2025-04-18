import express, { Router } from "express";
import {
  createChat,
  deleteChat,
  getUserChatsWithLastMessages,
} from "../controllers/ChatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.get("/chats", authMiddleware, getUserChatsWithLastMessages);
router.post("/chats", authMiddleware, createChat);
router.delete("/chats/:chatId", authMiddleware, deleteChat);

export default router;
