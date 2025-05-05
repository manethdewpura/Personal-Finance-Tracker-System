import { logger } from "../utils/winston.utils.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../services/categories.service.js";

const createCategoryController = async (req, res) => {
    logger.info("CategoryController - createCategoryController");
    try {
        const category = await createCategory(req.body);
        logger.info("Category created successfully");
        res.status(201).json(category);
    } catch (error) {
        logger.error("Error creating category");
        res.status(400).json({ message: error.message });
    }
}

const getCategoriesController = async (req, res) => {
    logger.info("CategoryController - getCategoriesController");
    try {
        const categories = await getCategories();
        logger.info("Fetched all categories");
        res.json(categories);
    } catch (error) {
        logger.error("Error fetching categories");
        res.status(500).json({ message: error.message });
    }
}

const updateCategoryController = async (req, res) => {
    logger.info("CategoryController - updateCategoryController");
    try {
        const category = await updateCategory(req.params.id, req.body);
        logger.info("Category updated successfully");
        res.json(category);
    } catch (error) {
        logger.error("Error updating category");
        res.status(400).json({ message: error.message });
    }
}

const deleteCategoryController = async (req, res) => {
    logger.info("CategoryController - deleteCategoryController");
    try {
        await deleteCategory(req.params.id);
        logger.info("Category deleted successfully");
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        logger.error("Error deleting category");
        res.status(400).json({ message: error.message });
    }
}

export { createCategoryController, getCategoriesController, updateCategoryController, deleteCategoryController };