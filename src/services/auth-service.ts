import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, role: string) {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}