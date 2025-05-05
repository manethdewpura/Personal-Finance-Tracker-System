import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getNotificationsController,
  updateNotificationsController,
  deleteNotificationsController,
} from "../controllers/notifications.controller.js";

const router = Router();

router.get(
  "/",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  getNotificationsController
);

router.put(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  updateNotificationsController
);

router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  deleteNotificationsController
);

export default router;
