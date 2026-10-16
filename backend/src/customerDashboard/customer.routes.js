import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"
import { getCustomerDashboardController, } from "./customer.controller.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("CUSTOMER"), getCustomerDashboardController);

export default router;
