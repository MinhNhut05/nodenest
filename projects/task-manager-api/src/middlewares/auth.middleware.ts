import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import env from "../config/env.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access token required" });
    return;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token, env.JWT_ACCESS_SECRET);
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
