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

export async function getVendorRevenueStats(vendorId) {
    const [
        paymentsByCurrency,
        refundsByCurrency,
        payoutsByCurrency,
    ] = await Promise.all([

        prisma.payment.groupBy({
            by: ["currency"],
            where: {
                status: {
                    in: ["PAID", "REFUNDED"],
                },
                booking: {
                    vendorId,
                },
            },
            _sum: {
                amount: true,
            },
            _count: {
                _all: true,
            },
        }),

        prisma.refund.groupBy({
            by: ["currency"],
            where: {
                status: "SUCCEEDED",
                payment: {
                    booking: {
                        vendorId,
                    },
                },
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.payout.groupBy({
            by: ["currency", "status"],
            where: {
                vendorId,
            },
            _sum: {
                grossAmount: true,
                commissionAmount: true,
                netAmount: true,
            },
        }),
    ]);

    const revenue = paymentsByCurrency.map((paymentGroup) => {
        const currency = paymentGroup.currency;

        const refundedAmount =
            refundsByCurrency.find(
                (refundGroup) => refundGroup.currency === currency
            )?._sum.amount ?? 0;

        const grossRevenue = paymentGroup._sum.amount ?? 0;

        return {
            currency,
            paymentCount: paymentGroup._count._all,
            grossRevenue,
            refundedAmount,
            netRevenue: Number(grossRevenue) - Number(refundedAmount),
        };
    });

    const payouts = payoutsByCurrency.map((payoutGroup) => ({
        currency: payoutGroup.currency,
        status: payoutGroup.status,
        grossAmount: payoutGroup._sum.grossAmount ?? 0,
        commissionAmount: payoutGroup._sum.commissionAmount ?? 0,
        netAmount: payoutGroup._sum.netAmount ?? 0,
    }));

    return {
        revenue,
        payouts,
    };
}

export async function getVendorBookingAnalytics(vendorId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    bookingTrends,
  ] = await Promise.all([
    prisma.booking.count({
      where: { vendorId },
    }),

    prisma.booking.count({
      where: { vendorId, status: "PENDING" },
    }),

    prisma.booking.count({
      where: { vendorId, status: "CONFIRMED" },
    }),

    prisma.booking.count({
      where: { vendorId, status: "COMPLETED" },
    }),

    prisma.booking.count({
      where: { vendorId, status: "CANCELLED" },
    }),

    prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        vendorId,
        createdAt: { gte: startDate },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  return {
    periodDays: days,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    confirmationRate:
      totalBookings > 0
        ? Number(
            ((confirmedBookings / totalBookings) * 100).toFixed(2)
          )
        : 0,
    cancellationRate:
      totalBookings > 0
        ? Number(
            ((cancelledBookings / totalBookings) * 100).toFixed(2)
          )
        : 0,
    bookingTrends,
  };
}

