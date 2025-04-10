import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  role: "user" | "admin";
}
const userRepository = AppDataSource.getRepository(User);

const generateTokens = (userId: number, role?: "user" | "admin") => {
  const accessToken = jwt.sign({ id: userId, role }, "secret", {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId, role }, "refreshSecret", {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
};

// Регистрация пользователя
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password, role = "user" } = req.body;
    if (!["user", "admin"].includes(role)) {
      res.status(400).json({ message: "Неверная роль" });
      return;
    }
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "Email уже используется" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({ name, email, passwordHash, role });
    await userRepository.save(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, "secret", {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: { id: newUser.id, name, email, role: newUser.role },
    });
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

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({ accessToken, user: { id: user.id, name: user.name, email } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ошибка при входе в систему" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      role:user.role,
      avatar:user.avatar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении данных" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({ message: "Нет refresh токена" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, "refreshSecret") as DecodedToken;
    const user = await userRepository.findOne({
      where: { id: decoded.id, refreshToken },
    });

    if (!user) {
      res.status(403).json({ message: "Неверный refresh токен" });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id
    );
    user.refreshToken = newRefreshToken;
    await userRepository.save(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Неверный refresh токен" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({ message: "Нет refresh токена" });
    return;
  }

  const user = await userRepository.findOne({ where: { refreshToken } });
  if (user) {
    user.refreshToken = undefined;
    await userRepository.save(user);
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Вы вышли из системы" });
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user?.id;
  console.log(req);
  if (!userId) {
    res.status(401).json({ message: "Неавторизован" });
    return;
  }

  try {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    const { name, bio } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await userRepository.save(user);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
  } catch (err) {
    console.error("Ошибка при обновлении профиля:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
