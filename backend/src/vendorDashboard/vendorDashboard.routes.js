import express from "express";
import {  getVendorDashboardController,} from "./vendorDashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("VENDOR"));

router.get("/", getVendorDashboardController);

export default router;

