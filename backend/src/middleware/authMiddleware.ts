import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Нет доступа" });
    return;
  }

  try {
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      res.status(401).json({ message: "Неверный формат токена" });
      return;
    }

    const decoded = jwt.verify(tokenParts[1], "secret") as DecodedToken;
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
};