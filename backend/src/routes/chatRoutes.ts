import express, { Router } from "express";
import { createChat } from "../controllers/ChatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/chats", authMiddleware, createChat);

export default router;