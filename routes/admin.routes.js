import express from "express";
import {
  getAllUsersController,
  updateUserRoleController,
  deleteUserController,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, authorize, getAllUsersController);

router.put("/:id", protect, authorize, updateUserRoleController);

router.delete("/:id", protect, authorize, deleteUserController);

export default router;
