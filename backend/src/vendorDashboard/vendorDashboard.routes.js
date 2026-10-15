import express from "express";
import { getVendorDashboardController, getVendorRevenueController, getVendorBookingAnalyticsController , getVendorServicePerformanceController} from "./vendorDashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("VENDOR"));

router.get("/", getVendorDashboardController);

router.get("/revenue", getVendorRevenueController);

router.get("/booking-analytics", authenticate, authorizeRoles("VENDOR"), getVendorBookingAnalyticsController);

router.get(  "/service-performance",  authenticate,  authorizeRoles("VENDOR"),  getVendorServicePerformanceController);

export default router;

