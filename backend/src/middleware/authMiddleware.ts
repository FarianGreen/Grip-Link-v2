import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Создаем интерфейс для расширения стандартного Request
interface AuthRequest extends Request {
  user?: { id: number; role: "user" | "admin" }; 
}

interface DecodedToken {
  id: number;
  role: "user" | "admin";
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
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
    req.user = { id: decoded.id, role: decoded.role }; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Нет доступа" });
    return;
  }
  next();
};
