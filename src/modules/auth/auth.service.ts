import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import config from "../../config";
import type { LoginPayload, SignupPayload, UserRole } from "./auth.types";

const signupUserIntoDB = async (payload: SignupPayload) => {
  const { name, email, password, role = "contributor" } = payload;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const allowedRoles: UserRole[] = ["contributor", "maintainer"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Role must be contributor or maintainer");
  }

  const existingUser = await pool.query(
    `
      SELECT id FROM users
      WHERE email = $1
    `,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

const loginUserFromDB = async (payload: LoginPayload) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const userResult = await pool.query(
    `
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  if (userResult.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = userResult.rows[0];

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "7d",
  });

  delete user.password;

  return {
    token,
    user,
  };
};

export const authService = {
  signupUserIntoDB,
  loginUserFromDB,
};
