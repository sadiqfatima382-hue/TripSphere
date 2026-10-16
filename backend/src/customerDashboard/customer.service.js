import { getCustomerDashboardStats, getCustomerUpcomingBookings, getCustomerRecentBookings } from "./customer.repository.js";

export async function getCustomerDashboardService(customerId) {
    const stats = await getCustomerDashboardStats(customerId);

    return stats;
}

export async function getCustomerUpcomingBookingsService(
    customerId,
    limit = 5
) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
        throw new Error("Limit must be an integer between 1 and 20");
    }

    return getCustomerUpcomingBookings(customerId, limit);
}

export async function getCustomerRecentBookingsService(
    customerId,
    limit = 5
) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
        throw new Error("Limit must be an integer between 1 and 20");
    }

    return getCustomerRecentBookings(customerId, limit);
}



