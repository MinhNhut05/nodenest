import jwt from "jsonwebtoken";

export const signToken = (
  payload: object,
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): jwt.JwtPayload => {
  return jwt.verify(token, secret) as jwt.JwtPayload;
};
