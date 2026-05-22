import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import type { UserRole } from "../modules/auth/auth.types";

const role = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        403,
        "Forbidden",
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};

export default role;
