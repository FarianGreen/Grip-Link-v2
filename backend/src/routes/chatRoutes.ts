import express, { Router } from "express";
import { createChat, getUserChatsWithLastMessages } from "../controllers/ChatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.get("/chats", authMiddleware, getUserChatsWithLastMessages);
router.post("/chats", authMiddleware, createChat);

export default router;