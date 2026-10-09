import { getAdminDashboardStats, getAdminRevenueStats,getAdminBookingTrends,getTopPerformingServices,getTopPerformingVendors,getAdminStatusBreakdown } from "./admin.repository.js";

export async function getAdminDashboardStatsService() {
    const stats = await getAdminDashboardStats();

    return {
        ...stats,
        generatedAt: new Date(),
    }
};

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
};

export async function getTopPerformingServicesService(limit = 10) {
  const services = await getTopPerformingServices({ limit });

  return {
    total: services.length,
    services,
    generatedAt: new Date(),
  };
}

export async function getTopPerformingVendorsService(limit = 10) {
  const vendors = await getTopPerformingVendors({ limit });

  return {
    total: vendors.length,
    vendors,
    generatedAt: new Date(),
  };
}

export async function getAdminStatusBreakdownService() {
  const breakdown = await getAdminStatusBreakdown();

  return {
    ...breakdown,
    generatedAt: new Date(),
  };
}




