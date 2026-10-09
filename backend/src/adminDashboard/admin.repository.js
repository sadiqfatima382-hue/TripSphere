import prisma from "../config/prisma.js";

export async function getAdminDashboardStats() {
    const [
        totalUsers, totalCustomers,
        totalVendors, pendingVendors, approvedVendors,
        totalServices, pendingServices, approvedServices,
        totalBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings,
        totalPayments, pendingPayments, paidPayments,
        totalRefunds, pendingRefunds,
        totalPayouts, pendingPayouts,
        activeCoupons,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: {
                role: {
                    name: "CUSTOMER",
                },
            },
        }),

        prisma.vendor.count(),

        prisma.vendor.count({
            where: {
                status: "PENDING",
            },
        }),

        prisma.vendor.count({
            where: {
                status: "APPROVED",
            },
        }),

        prisma.service.count(),

        prisma.service.count({
            where: {
                status: "DRAFT",
            },
        }),

        prisma.service.count({
            where: {
                status: "APPROVED",
            },
        }),

        prisma.booking.count(),

        prisma.booking.count({
            where: {
                status: "PENDING",
            },
        }),

        prisma.booking.count({
            where: {
                status: "CONFIRMED",
            },
        }),

        prisma.booking.count({
            where: {
                status: "COMPLETED",
            },
        }),

        prisma.booking.count({
            where: {
                status: "CANCELLED",
            },
        }),

        prisma.payment.count(),

        prisma.payment.count({
            where: {
                status: "PENDING",
            },
        }),

        prisma.payment.count({
            where: {
                status: "PAID",
            },
        }),

        prisma.refund.count(),

        prisma.refund.count({
            where: {
                status: {
                    in: ["PENDING", "PROCESSING"],
                },
            },
        }),

        prisma.payout.count(),

        prisma.payout.count({
            where: {
                status: {
                    in: ["PENDING", "PROCESSING"],
                },
            },
        }),

        prisma.coupon.count({
            where: {
                isActive: true,
            },
        }),
    ]);

    return {
        users: {
            total: totalUsers,
            customers: totalCustomers,
        },

        vendors: {
            total: totalVendors,
            pending: pendingVendors,
            approved: approvedVendors,
        },

        services: {
            total: totalServices,
            pending: pendingServices,
            approved: approvedServices,
        },

        bookings: {
            total: totalBookings,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings,
            cancelled: cancelledBookings,
        },

        payments: {
            total: totalPayments,
            pending: pendingPayments,
            paid: paidPayments,
        },

        refunds: {
            total: totalRefunds,
            pending: pendingRefunds,
        },

        payouts: {
            total: totalPayouts,
            pending: pendingPayouts,
        },

        coupons: {
            active: activeCoupons,
        },
    };
}