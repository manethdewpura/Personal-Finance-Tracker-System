import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { logger } from "../utils/winston.utils.js";
import bcrypt from "bcryptjs";
import ThrowError from "../utils/error.utils.js";

const registerUser = async (userData) => {
  logger.info("AuthService - registerUser");
  try {
    logger.info("Creating new user");
    return await User.create(userData);
  } catch (error) {
    logger.error("Error creating user");
    throw ThrowError(error);
  }
};

const loginUser = async (email, password) => {
  logger.info("AuthService - loginUser");
  try {
    logger.info("Fetching user by email");
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    logger.info("Checking password");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    logger.info("Generating token");
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    return { id: user._id, token };
  } catch (error) {
    logger.error("Error logging in user");
    throw ThrowError(error);
  }
};

// const getCurrentUser = async (userId) => {
//   logger.info("AuthService - getCurrentUser");
//   try {
//     logger.info("Fetching user by id");
//     const user = await User.findById(userId).select("-password");
//     res.json(user);
//   } catch (error) {
//     logger.error("Error fetching user");
//     throw ThrowError(error);
//   }
// };

export { registerUser, loginUser };
