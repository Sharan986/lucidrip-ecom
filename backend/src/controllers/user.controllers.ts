import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";



export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get data (Accepts 'name' from your React form)
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please fill in all fields" });
      return;
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await User.create({
      username: name,
      email,
      passwordHash: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        message: "Account created successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};