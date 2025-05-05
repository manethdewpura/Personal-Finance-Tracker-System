import express from "express";
import { check, validationResult } from "express-validator";
import { protect } from "../middleware/auth.middleware.js";
import {
  createBudgetController,
  getBudgetsController,
  updateBudgetController,
  deleteBudgetController,
} from "../controllers/budget.controller.js";
const router = express.Router();

router.post(
  "/",
  protect,
  [
    check("name", "Name is required").not().isEmpty(),
    check("amount", "Amount is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.user = res.locals.user;
    next();
  },
  createBudgetController
);

router.get(
  "/",
  protect,
  (req, res, next) => {
    req.body.user = res.locals.user;
    next();
  },
  getBudgetsController
);

router.put(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  updateBudgetController
);

router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  deleteBudgetController
);

export default router;
