import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Нет доступа" });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, "secret");
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
};
