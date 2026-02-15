import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;
    const result = await authService.register(email, name, password);
    res.status(201).json({ message: "User registered", data: result });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ message: "Login successful", data: result });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.status(200).json({ message: "Token refreshed", data: result });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).userId;
    await authService.logout(userId);
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};
