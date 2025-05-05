import User from "../models/user.model.js";
import ThrowError from "../utils/error.utils.js";
import { logger } from "../utils/winston.utils.js";

const getAllUsers = async () => {
  logger.info("adminService - getAllUsers");
  try {
    logger.info("Fetching all users");
    return await User.find();
  } catch (error) {
    logger.error("Error fetching users");
    throw ThrowError(error);
  }
};

const updateUserRole = async (id, userData) => {
  logger.info(`adminService - updateUserRole`);
  try {
    logger.info(`Updating user with ID: ${id}`);
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user with ID: ${id}`);
    throw ThrowError(error);
  }
};

const deleteUser = async (id) => {
  logger.info(`adminService - deleteUser`);
  try {
    logger.info(`Deleting user with ID: ${id}`);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return true;
  } catch (error) {
    logger.error(`Error deleting user with ID: ${id}`);
    throw ThrowError(error);
  }
};

export default { getAllUsers, updateUserRole, deleteUser };
