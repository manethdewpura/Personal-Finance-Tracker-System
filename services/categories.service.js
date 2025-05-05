import { logger } from "../utils/winston.utils.js";
import ThrowError from "../utils/error.utils.js";
import Category from "../models/categories.model.js";

const createCategory = async (categoryData) => {
  logger.info("CategoryService - createCategory");
  try {
    logger.info("Creating new category");
    return await Category.create(categoryData);
  } catch (error) {
    logger.error("Error creating category");
    throw ThrowError(error);
  }
};

const getCategories = async () => {
  logger.info("CategoryService - getCategories");
  try {
    logger.info("Fetching all categories");
    return await Category.find();
  } catch (error) {
    logger.error("Error fetching categories");
    throw ThrowError(error);
  }
};

const updateCategory = async (id, categoryData) => {
  logger.info(`CategoryService - updateCategory`);
  try {
    logger.info(`Updating category with ID: ${id}`);
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
  } catch (error) {
    logger.error(`Error updating category with ID: ${id}`);
    throw ThrowError(error);
  }
};

const deleteCategory = async (id) => {
  logger.info(`CategoryService - deleteCategory`);
  try {
    logger.info(`Deleting category with ID: ${id}`);
    await Category.findByIdAndDelete(id);
    return true;
  } catch (error) {
    logger.error(`Error deleting category with ID: ${id}`);
    throw ThrowError(error);
  }
};

export {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
