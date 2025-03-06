import express, { Request, Response, Router } from "express";
import { body, ValidationChain } from "express-validator";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/UserController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Валидация данных перед регистрацией
const registerValidation: ValidationChain[] = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно содержать минимум 3 символа"),
  body("email").isEmail().withMessage("Некорректный email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов"),
];


router.post("/register", registerValidation, (req: Request, res: Response) =>
  register(req, res)
);
router.post("/login", (req: Request, res: Response) => login(req, res));
router.get("/me", authMiddleware, (req: Request, res: Response) =>
  getMe(req, res)
);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/admin-only", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Только для админов" });
});

export default router;
