import express from "express";
import { check, validationResult } from "express-validator";
import { protect } from "../middleware/auth.middleware.js";
import {
  createTransactionController,
  getTransactionsController,
  updateTransactionController,
  deleteTransactionController,
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    check("amount", "Amount is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("type", "Type is required").not().isEmpty(),
    check("currency", "Currency is required").not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.user = res.locals.user;
    next();
  },
  createTransactionController
);

router.get(
  "/",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  getTransactionsController
);

router.put(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  updateTransactionController
);

router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  deleteTransactionController
);

export default router;
