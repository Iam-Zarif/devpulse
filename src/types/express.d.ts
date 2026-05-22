import type { UserRole } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: UserRole;
      };
    }
  }
}

export {};
