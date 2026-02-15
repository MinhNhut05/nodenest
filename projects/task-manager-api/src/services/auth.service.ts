import prisma from "../config/prisma.js";
import env from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken, verifyToken } from "../utils/jwt.js";

const generateTokens = (userId: string) => {
  const accessToken = signToken(
    { userId },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN,
  );
  const refreshToken = signToken(
    { userId },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN,
  );
  return { accessToken, refreshToken };
};

export const register = async (
  email: string,
  name: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
};

export const refresh = async (token: string) => {
  const decoded = verifyToken(token, env.JWT_REFRESH_SECRET);

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
};

export const logout = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};
