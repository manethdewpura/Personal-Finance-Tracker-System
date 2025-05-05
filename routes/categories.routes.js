import express from "express";
import { check, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { createCategoryController, getCategoriesController, updateCategoryController, deleteCategoryController } from "../controllers/categories.controller.js";


const router = express.Router();

router.post(
    "/",
    protect,
    authorize,
    [
        check("category", "Category is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createCategoryController
);

router.get("/", protect, getCategoriesController);

router.put("/:id", protect, authorize, updateCategoryController);

router.delete("/:id", protect, authorize, deleteCategoryController);

export default router;