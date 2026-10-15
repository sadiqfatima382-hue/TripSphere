import { getVendorDashboardStats, getVendorRevenueStats, getVendorBookingAnalytics } from "./vendorDashboard.repository.js";

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

export async function getVendorDashboardRevenueService(vendorId) {
  if (!vendorId) {
    throw new Error("Vendor ID is required");
  }

  const stats = await getVendorRevenueStats(vendorId);

  return {
    revenue: stats.revenue,
    payouts: stats.payouts,
  }

}

export async function getVendorBookingAnalyticsService(vendorId , days=30) {

  return getVendorBookingAnalytics(vendorId, days)
  
}