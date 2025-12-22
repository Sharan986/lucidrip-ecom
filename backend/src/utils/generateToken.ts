import jwt from "jsonwebtoken";
import { Types } from "mongoose";

/**
 * Generate JWT Token for authentication
 * @param userId - MongoDB ObjectId of the user
 * @returns JWT token string
 */
export const generateToken = (userId: Types.ObjectId): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null
 */
export const verifyToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
  } catch (error) {
    return null;
  }
};
