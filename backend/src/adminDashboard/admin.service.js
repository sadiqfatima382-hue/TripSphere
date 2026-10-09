import { getAdminDashboardStats } from "./admin.repository.js";

export async function getAdminDashboardStatsService() {
    const stats = await getAdminDashboardStats();

    return {
        ...stats,
        generatedAt: new Date(),
    }
}