import express from "express";
import {  getAllUsersController,  getUserByIdController, updateUserStatusController} from "./adminUser.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/", getAllUsersController);

router.patch("/:id/status", updateUserStatusController);

router.get("/:id", getUserByIdController);

export default router;

