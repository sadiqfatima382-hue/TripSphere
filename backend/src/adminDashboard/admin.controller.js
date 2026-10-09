import { getAdminDashboardStatsService } from "./admin.service.js";

export async function getAdminDashboardStatsController(req, res, next) {
    try {
        const stats = await getAdminDashboardStatsService();
        return res.status(200).json({
            success: true,
            message: "Admin dashboard statistics fetched successfully",
            data: stats,
        });
    } catch (error) {
 return res.status(500).json({
            success: false,
            message:error.message,
        })
    }

}