import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Message } from "../entities/Message";

interface AuthRequest extends Request {
  user?: { id: number };
}

const messageRepository = AppDataSource.getRepository(Message);

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { senderId, receiverId, content } = req.body;
  const message = messageRepository.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });
  await messageRepository.save(message);
  res.status(201).json(message);
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;
  const messages = await messageRepository.find({
    where: [{ sender: userId }, { receiver: userId }],
  });
  res.json(messages);
};
