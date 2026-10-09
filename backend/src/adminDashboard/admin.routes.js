import express from "express"
import { getAdminDashboardStatsController, getAdminRevenueController } from "./admin.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.get( "/AdminDashboard", authenticate, authorizeRoles("ADMIN"), getAdminDashboardStatsController );

router.get(  "/revenue",  authenticate,  authorizeRoles("ADMIN"),  getAdminRevenueController);

export default router;