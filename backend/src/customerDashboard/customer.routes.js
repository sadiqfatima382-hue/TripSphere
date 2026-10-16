import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getCustomerDashboardController, getCustomerUpcomingBookingsController, getCustomerRecentBookingsController } from "./customer.controller.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("CUSTOMER"), getCustomerDashboardController);

router.get(  "/upcoming-bookings",  authenticate,  authorizeRoles("CUSTOMER"),  getCustomerUpcomingBookingsController);

router.get(  "/recent-bookings",  authenticate,  authorizeRoles("CUSTOMER"),  getCustomerRecentBookingsController);


export default router;
