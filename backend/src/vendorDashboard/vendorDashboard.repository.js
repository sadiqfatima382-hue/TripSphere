import prisma from "../config/prisma.js";

export async function getVendorDashboardStats(vendorId) {
    const [
        totalServices,
        approvedServices, pendingServices, suspendedServices,
        totalBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings,
        pendingPayouts, processingPayouts, paidPayouts, failedPayouts,
    ] = await Promise.all([
        prisma.service.count({
            where: { vendorId },
        }),

        prisma.service.count({
            where: {
                vendorId,
                status: "APPROVED",
                isActive: true,
            },
        }),

        prisma.service.count({
            where: {
                vendorId,
                status: "DRAFT",
            },
        }),

        prisma.service.count({
            where: {
                vendorId,
                status: "SUSPENDED",
            },
        }),

        prisma.booking.count({
            where: { vendorId },
        }),

        prisma.booking.count({
            where: {
                vendorId,
                status: "PENDING",
            },
        }),

        prisma.booking.count({
            where: {
                vendorId,
                status: "CONFIRMED",
            },
        }),

        prisma.booking.count({
            where: {
                vendorId,
                status: "COMPLETED",
            },
        }),

        prisma.booking.count({
            where: {
                vendorId,
                status: "CANCELLED",
            },
        }),

        prisma.payout.count({
            where: {
                vendorId,
                status: "PENDING",
            },
        }),

        prisma.payout.count({
            where: {
                vendorId,
                status: "PROCESSING",
            },
        }),

        prisma.payout.count({
            where: {
                vendorId,
                status: "PAID",
            },
        }),

        prisma.payout.count({
            where: {
                vendorId,
                status: "FAILED",
            },
        }),
    ]);

    return {
        services: {
            total: totalServices,
            approved: approvedServices,
            pending: pendingServices,
            suspended: suspendedServices,
        },

        bookings: {
            total: totalBookings,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
        },

        payouts: {
            pending: pendingPayouts,
            processing: processingPayouts,
            paid: paidPayouts,
            failed: failedPayouts,
        },
    };
}

