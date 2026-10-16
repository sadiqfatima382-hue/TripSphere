import { getCustomerDashboardService, getCustomerUpcomingBookingsService, getCustomerRecentBookingsService } from "./customer.service.js";

export async function getCustomerDashboardController(req, res, next) {
    try {
        const stats = await getCustomerDashboardService(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Customer dashboard fetched successfully",
            data: stats,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getCustomerUpcomingBookingsController(req, res, next) {
    try {
        const limit = Number(req.query.limit ?? 5);

        if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
            return res.status(400).json({
                success: false,
                message: "Limit must be an integer between 1 and 20",
            });
        }

        const bookings = await getCustomerUpcomingBookingsService(
            req.user.id,
            limit
        );

        return res.status(200).json({
            success: true,
            message: "Upcoming bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getCustomerRecentBookingsController(req, res, next) {
    try {
        const limit = Number(req.query.limit ?? 5);

        if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
            return res.status(400).json({
                success: false,
                message: "Limit must be an integer between 1 and 20",
            });
        }

        const bookings = await getCustomerRecentBookingsService(
            req.user.id,
            limit
        );

        return res.status(200).json({
            success: true,
            message: "Recent bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

