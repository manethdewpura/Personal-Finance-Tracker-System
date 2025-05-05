import express from "express";
import { check, validationResult } from "express-validator";
import { protect } from "../middleware/auth.middleware.js";
import {
  createTagController,
  getTagsController,
  updateTagController,
  deleteTagController,
} from "../controllers/tags.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [check("tag", "Tag is required").not().isEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.user = res.locals.user;
    next();
  },
  createTagController
);

router.get(
  "/",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  getTagsController
);

router.put(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  updateTagController
);

router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  deleteTagController
);

export default router;
