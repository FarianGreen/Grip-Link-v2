import express, { Router } from "express";
import { sendMessage, getMessages } from "../controllers/MessageController";
import { authMiddleware } from "../middleware/authMiddleware";


const router: Router = express.Router()
router.post("/send", authMiddleware, sendMessage);
router.get("/", authMiddleware, getMessages);

export default router