import { getAdminDashboardStats, getAdminRevenueStats,getAdminBookingTrends } from "./admin.repository.js";

export async function getAdminDashboardStatsService() {
    const stats = await getAdminDashboardStats();

    return {
        ...stats,
        generatedAt: new Date(),
    }
}

export async function getAdminRevenueService() {
    const revenue = await getAdminRevenueStats();
    return {
        ...revenue, generatedAt: new Date(),

    }
};

export async function getAdminBookingTrendsService(days = 7) {
  const trends = await getAdminBookingTrends({ days });

  return {
    ...trends,
    generatedAt: new Date(),
  };
}

