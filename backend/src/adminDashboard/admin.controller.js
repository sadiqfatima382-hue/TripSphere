import { getAdminDashboardStatsService, getAdminRevenueService, getAdminBookingTrendsService } from "./admin.service.js";

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
            message: error.message,
        })
    }

}

export async function getAdminRevenueController(req, res, next) {
    try {
        const revenue = await getAdminRevenueService();

        return res.status(200).json({
            success: true,
            message: "Admin revenue analytics fetched successfully",
            data: revenue,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getAdminBookingTrendsController(req, res, next) {
    try {
        const days = Number(req.query.days ?? 7);

        if (!Number.isInteger(days) || days < 1 || days > 365) {
            return res.status(400).json({
                success: false,
                message: "Days must be an integer between 1 and 365",
            });
        }

        const trends = await getAdminBookingTrendsService(days);

        return res.status(200).json({
            success: true,
            message: "Admin booking trends fetched successfully",
            data: trends,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}