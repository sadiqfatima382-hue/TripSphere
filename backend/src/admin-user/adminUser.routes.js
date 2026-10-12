import express from "express";
import {  getAllUsersController,  getUserByIdController, updateUserStatusController} from "./adminUser.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// All routes require an authenticated ADMIN
router.use(authenticate, authorizeRoles("ADMIN"));

// GET /api/v1/admin/users
router.get("/", getAllUsersController);

router.patch("/:id/status", updateUserStatusController);

// GET /api/v1/admin/users/:id
router.get("/:id", getUserByIdController);

export default router;

