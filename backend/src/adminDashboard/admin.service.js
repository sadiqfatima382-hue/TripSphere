import { getAdminDashboardStats, getAdminRevenueStats } from "./admin.repository.js";

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