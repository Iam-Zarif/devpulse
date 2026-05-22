import type { LoginPayload, SignupPayload, UserRole } from "./auth.types";

const allowedRoles: UserRole[] = ["contributor", "maintainer"];

const validateSignupPayload = (payload: SignupPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  if (role && !allowedRoles.includes(role)) {
    throw new Error("Role must be contributor or maintainer");
  }
};

const validateLoginPayload = (payload: LoginPayload) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }
};

export const authValidation = {
  validateSignupPayload,
  validateLoginPayload,
};
