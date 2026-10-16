import {  getCustomerDashboardService,} from "./customer.service.js";

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

