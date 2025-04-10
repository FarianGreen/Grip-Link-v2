import express, { Request, Response, Router } from "express";
import { body, ValidationChain } from "express-validator";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  updateProfile,
} from "../controllers/UserController";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { uploadAvatar } from "../middleware/uploadAvatar";
import { updateAvatar } from "../controllers/AuthController";

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
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.put("/profile", authMiddleware, updateProfile);
router.put(
  "/profile/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  updateAvatar
);

router.post("/admin-only", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Только для админов" });
});

export default router;
