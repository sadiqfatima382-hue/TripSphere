import express from "express"
import { getAdminDashboardStatsController, getAdminRevenueController,getAdminBookingTrendsController,getTopPerformingServicesController } from "./admin.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.get( "/AdminDashboard", authenticate, authorizeRoles("ADMIN"), getAdminDashboardStatsController );

router.get(  "/revenue",  authenticate,  authorizeRoles("ADMIN"),  getAdminRevenueController);

router.get(  "/booking-trends",  authenticate,  authorizeRoles("ADMIN"),  getAdminBookingTrendsController);

router.get(  "/top-services",  authenticate,  authorizeRoles("ADMIN"),  getTopPerformingServicesController);

export default router;