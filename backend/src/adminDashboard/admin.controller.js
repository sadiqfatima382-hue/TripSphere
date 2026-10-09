import { getAdminDashboardStatsService, getAdminRevenueService, getAdminBookingTrendsService,getTopPerformingServicesService ,getTopPerformingVendorsService ,getAdminStatusBreakdownService} from "./admin.service.js";

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

export async function getTopPerformingServicesController(req, res, next) {
  try {
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be an integer between 1 and 100",
      });
    }

    const result = await getTopPerformingServicesService(limit);

    return res.status(200).json({
      success: true,
      message: "Top-performing services fetched successfully",
      data: result,
    });
  } catch (error) {
     return res.status(500).json({
            success: false,
            message: error.message,
        })
  }
}

export async function getTopPerformingVendorsController(req, res, next) {
  try {
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be an integer between 1 and 100",
      });
    }

    const result = await getTopPerformingVendorsService(limit);

    return res.status(200).json({
      success: true,
      message: "Top-performing vendors fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
            success: false,
            message: error.message,
        })
  }
}

export async function getAdminStatusBreakdownController(req, res, next) {
  try {
    const breakdown = await getAdminStatusBreakdownService();

    return res.status(200).json({
      success: true,
      message: "Admin status breakdown fetched successfully",
      data: breakdown,
    });
  } catch (error) {
    return res.status(500).json({
            success: false,
            message: error.message,
        })
  }
}

