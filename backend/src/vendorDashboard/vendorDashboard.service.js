import {  getVendorDashboardStats,} from "./vendorDashboard.repository.js";

export async function getVendorDashboardService(vendorId) {
  if (!vendorId) {
    throw new Error("Vendor ID is required");
  }

  const stats = await getVendorDashboardStats(vendorId);

  return {
    services: stats.services,
    bookings: stats.bookings,
    payouts: stats.payouts,
  };
}

