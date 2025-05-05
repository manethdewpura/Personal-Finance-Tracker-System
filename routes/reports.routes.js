import express from "express";
import {getAllReportsController, getReportsByUserIdcontroller} from "../controllers/reports.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getAllReportsController } from "../controllers/reports.controller.js";

const router = express.Router();

// Use the reports controller for routes starting with /reports
router.use(
  "/",
  protect,
  (req, res, next) => {
    (req.body.user = res.locals.user), next();
  },
  getReportsByUserIdcontroller
);

router.get("/allreports",protect, authorize, getAllReportsController);

export default router;
