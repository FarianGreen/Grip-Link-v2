import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

// Регистрация пользователя
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "Email уже используется" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({ name, email, passwordHash });
    await userRepository.save(newUser);

    const token = jwt.sign({ id: newUser.id }, "secret", { expiresIn: "30d" });

    res.status(201).json({ token, user: { id: newUser.id, name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка регистрации" });
  }
};

// Логин пользователя
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "30d" });

    res.json({ token, user: { id: user.id, name: user.name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при входе в систему" });
  }
};

// Получение информации о себе
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении данных" });
  }
};
