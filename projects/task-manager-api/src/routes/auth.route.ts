import { Router } from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", authMiddleware, logoutController);
//                      ↑ logout cần authMiddleware vì phải biết userId

export default router;
