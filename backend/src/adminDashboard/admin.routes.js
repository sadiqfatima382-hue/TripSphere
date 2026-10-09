import express from "express"
import { getAdminDashboardStatsController } from "./admin.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.get( "/AdminDashboard", authenticate, authorizeRoles("ADMIN"), getAdminDashboardStatsController );

export default router;