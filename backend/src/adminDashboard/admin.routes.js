import express from "express"
import { getAdminDashboardStatsController, getAdminRevenueController,getAdminBookingTrendsController,getTopPerformingServicesController,getTopPerformingVendorsController,getAdminStatusBreakdownController } from "./admin.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.get( "/AdminDashboard", authenticate, authorizeRoles("ADMIN"), getAdminDashboardStatsController );

router.get(  "/revenue",  authenticate,  authorizeRoles("ADMIN"),  getAdminRevenueController);

router.get(  "/booking-trends",  authenticate,  authorizeRoles("ADMIN"),  getAdminBookingTrendsController);

router.get(  "/top-services",  authenticate,  authorizeRoles("ADMIN"),  getTopPerformingServicesController);

router.get(  "/top-vendors",  authenticate,  authorizeRoles("ADMIN"),  getTopPerformingVendorsController);

router.get(  "/status-breakdown",  authenticate,  authorizeRoles("ADMIN"),  getAdminStatusBreakdownController);

export default router;