import express, { Router } from "express";
import { sendMessage, getMessages } from "../controllers/MessageController";
import { authMiddleware } from "../middleware/authMiddleware";


const router: Router = express.Router()
router.post("/messages/send", authMiddleware, sendMessage);
router.get("/messages/:chatId", authMiddleware, getMessages);

export default router