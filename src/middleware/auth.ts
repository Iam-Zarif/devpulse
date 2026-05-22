import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError(401, "Unauthorized access", "JWT token is missing");
    }

    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : authorization;

    if (!token) {
      throw new AppError(401, "Unauthorized access", "JWT token is missing");
    }

    const decoded = verifyToken(token);

    if (!decoded.id || !decoded.name || !decoded.role) {
      throw new AppError(401, "Invalid token", "Token payload is invalid");
    }

    req.user = {
      id: Number(decoded.id),
      name: decoded.name as string,
      role: decoded.role as "contributor" | "maintainer",
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid token", error.message));
      return;
    }

    next(error);
  }
};

export default auth;
