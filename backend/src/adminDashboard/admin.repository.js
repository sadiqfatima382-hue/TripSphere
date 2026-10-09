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

export async function getAdminRevenueStats() {
  const [paidPayments, successfulRefunds] = await Promise.all([
    prisma.payment.groupBy({
      by: ["currency"],
      where: {
        status: "PAID",
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
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const refundsByCurrency = Object.fromEntries(
    successfulRefunds.map((refund) => [
      refund.currency,
      Number(refund._sum.amount ?? 0),
    ])
  );

  const revenueByCurrency = paidPayments.map((payment) => {
    const grossRevenue = Number(payment._sum.amount ?? 0);
    const refundedAmount = refundsByCurrency[payment.currency] ?? 0;

    return {
      currency: payment.currency,
      grossRevenue,
      refundedAmount,
      netRevenue: Number((grossRevenue - refundedAmount).toFixed(2)),
      paidPaymentCount: payment._count._all,
    };
  });

  // Include currencies that have refunds but no currently PAID payments.
  for (const refund of successfulRefunds) {
    const alreadyIncluded = revenueByCurrency.some(
      (item) => item.currency === refund.currency
    );

    if (!alreadyIncluded) {
      const refundedAmount = Number(refund._sum.amount ?? 0);

      revenueByCurrency.push({
        currency: refund.currency,
        grossRevenue: 0,
        refundedAmount,
        netRevenue: Number((0 - refundedAmount).toFixed(2)),
        paidPaymentCount: 0,
      });
    }
  }

  return {
    revenueByCurrency,
  };
}

