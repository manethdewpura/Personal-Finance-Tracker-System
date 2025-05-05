import { Router } from "express";
import { check, validationResult } from "express-validator";
import { protect } from "../middleware/auth.middleware.js";
import {
  createGoalController,
  getGoalsController,
  updateGoalController,
  deleteGoalController,
} from "../controllers/goals.controller.js";

const router = Router();

router.post(
  "/",
  protect,
  [
    check("name", "Name is required").not().isEmpty(),
    check("amount", "Amount is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("monthlyContribution", "Monthly Contribution is required")
      .not()
      .isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.user = res.locals.user;
    next();
  },
  createGoalController
);

router.get(
  "/",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  getGoalsController
);

router.put(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  updateGoalController
);

router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  deleteGoalController
);

export default router;
