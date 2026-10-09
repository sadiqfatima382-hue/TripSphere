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

export async function getAdminBookingTrends({ days = 7 } = {}) {
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

  const bookings = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('day', "createdAt") AS date,
      COUNT(*)::int AS total
    FROM "bookings"
    WHERE "createdAt" >= ${startDate}
    GROUP BY DATE_TRUNC('day', "createdAt")
    ORDER BY date ASC
  `;

  return {
    period: {
      days,
      startDate,
      endDate: new Date(),
    },
    bookings: bookings.map((booking) => ({
      date: booking.date,
      total: booking.total,
    })),
  };
}

export async function getTopPerformingServices({ limit = 10 } = {}) {
  const services = await prisma.service.findMany({
    take: limit,
    orderBy: {
      bookings: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      currency: true,
      basePrice: true,
      averageRating: true,
      reviewCount: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    city: service.city,
    country: service.country,
    currency: service.currency,
    basePrice: Number(service.basePrice),
    averageRating: Number(service.averageRating),
    reviewCount: service.reviewCount,
    totalBookings: service._count.bookings,
  }));
}

export async function getTopPerformingVendors({ limit = 10 } = {}) {
  const vendors = await prisma.vendor.findMany({
    take: limit,
    orderBy: {
      bookings: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      businessName: true,
      status: true,
      country: true,
      city: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: {
          bookings: true,
          services: true,
        },
      },
    },
  });

  return vendors.map((vendor) => ({
    id: vendor.id,
    businessName: vendor.businessName,
    status: vendor.status,
    country: vendor.country,
    city: vendor.city,
    owner: vendor.owner,
    totalBookings: vendor._count.bookings,
    totalServices: vendor._count.services,
  }));
}

export async function getAdminStatusBreakdown() {
  const [
    bookingStatuses,
    paymentStatuses,
  ] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    prisma.payment.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    bookings: bookingStatuses.map((item) => ({
      status: item.status,
      count: item._count._all,
    })),

    payments: paymentStatuses.map((item) => ({
      status: item.status,
      count: item._count._all,
      amount: Number(item._sum.amount ?? 0),
    })),
  };
}



