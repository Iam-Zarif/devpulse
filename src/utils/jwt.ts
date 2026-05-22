import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { UserRole } from "../modules/auth/auth.types";

type TJwtPayload = {
  id: number;
  name: string;
  role: UserRole;
};

export const createToken = (payload: TJwtPayload) => {
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret as string) as JwtPayload;
};
