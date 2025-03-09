import express, { Router } from "express";
import { sendMessage, getMessages, getChatMessages } from "../controllers/MessageController";
import { authMiddleware } from "../middleware/authMiddleware";


const router: Router = express.Router()
router.post("/messages/send", authMiddleware, sendMessage);
router.get("/messages/:chatId", authMiddleware, getMessages);
router.get("/chats/:chatId/messages", authMiddleware, getChatMessages);

export default router