import user from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(currentDirectory, "../utils/.env");

dotenv.config({ path: envPath });

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await user.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: foundUser.id_user,
      role: foundUser.role,
      username: foundUser.username,
    };
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({ token, message: 'Login successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ token:"", message: error.message });
  }
};
