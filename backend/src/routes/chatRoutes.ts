import express, { Router } from "express";
import { createChat, getUserChats } from "../controllers/ChatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.get("/chats", authMiddleware, getUserChats);
router.post("/chats", authMiddleware, createChat);

export default router;