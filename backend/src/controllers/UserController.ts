import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const userRepository = AppDataSource.getRepository(User);

// Регистрация пользователя
export const register = async (req: Request, res: Response) => {
  try {
    // Проверяем ошибки валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Проверяем, существует ли уже пользователь
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email уже используется" });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Создаём пользователя
    const newUser = userRepository.create({ name, email, passwordHash });
    await userRepository.save(newUser);

    // Создаём токен
    const token = jwt.sign({ id: newUser.id }, "secret", { expiresIn: "30d" });

    res.status(201).json({ token, user: { id: newUser.id, name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка регистрации" });
  }
};

// Логин пользователя
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "30d" });

    res.json({ token, user: { id: user.id, name: user.name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при входе в систему" });
  }
};

// Получение информации о себе
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Получаем ID из middleware

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении данных" });
  }
};
