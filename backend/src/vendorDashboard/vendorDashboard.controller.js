import {  getVendorDashboardService, getVendorDashboardRevenueService} from "./vendorDashboard.service.js";

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
