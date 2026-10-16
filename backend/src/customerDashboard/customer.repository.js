import prisma from "../config/prisma.js";

export async function getCustomerDashboardStats(customerId) {
    const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
    ] = await Promise.all([
        prisma.booking.count({
            where: { customerId },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "PENDING",
            },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "CONFIRMED",
            },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "COMPLETED",
            },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "CANCELLED",
            },
        }),
    ]);

    return {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
    };
}