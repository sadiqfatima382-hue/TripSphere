import { getVendorDashboardService, getVendorDashboardRevenueService , getVendorBookingAnalyticsService} from "./vendorDashboard.service.js";

export async function getVendorDashboardController(req, res, next) {
  try {
    const vendorId = req.user.vendorId;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const dashboard = await getVendorDashboardService(vendorId);

    return res.status(200).json({
      success: true,
      message: "Vendor dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function getVendorRevenueController(req, res, next) {
  try {
    const vendorId = req.user.vendorId;

    if (!vendorId) {
      return res.status(403).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const revenue = await getVendorDashboardRevenueService(vendorId);

    return res.status(200).json({
      success: true,
      message: "Vendor revenue analytics fetched successfully",
      data: revenue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function getVendorBookingAnalyticsController(req, res, next) {
  try {
    const days = Number(req.query.days ?? 30);

    if (!Number.isInteger(days) || days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: "Days must be an integer between 1 and 365",
      });
    }

    const analytics = await getVendorBookingAnalyticsService(
      req.user.vendorId,
      days
    );

    return res.status(200).json({
      success: true,
      message: "Vendor booking analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function getVendorServicePerformanceController(req, res, next) {
  try {
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be an integer between 1 and 100",
      });
    }

    const services = await getVendorServicePerformanceService(
      req.user.vendorId,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Vendor service performance fetched successfully",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
