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

export async function getCustomerUpcomingBookings(customerId, limit = 5) {
    return prisma.booking.findMany({
        where: {
            customerId,
            status: {
                in: ["PENDING", "CONFIRMED"],
            },
            startDate: {
                gte: new Date(),
            },
        },
        select: {
            id: true,
            bookingNumber: true,
            startDate: true,
            endDate: true,
            quantity: true,
            totalPrice: true,
            currency: true,
            status: true,
            service: {
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                },
            },
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                },
            },
        },
        orderBy: {
            startDate: "asc",
        },
        take: limit,
    });
}

export async function getCustomerRecentBookings(customerId, limit = 5) {
    return prisma.booking.findMany({
        where: {
            customerId,
        },
        select: {
            id: true,
            bookingNumber: true,
            startDate: true,
            endDate: true,
            quantity: true,
            subtotal: true,
            discountAmount: true,
            totalPrice: true,
            currency: true,
            status: true,
            createdAt: true,
            service: {
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                },
            },
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
    });
}

