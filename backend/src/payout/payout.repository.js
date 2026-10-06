import prisma from "../config/prisma.js";

export async function createPayout(data) {
  return prisma.payout.create({
    data,
    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          ownerId: true,
        },
      },
      booking: {
        include: {
          service: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function findPayoutById(id) {
  return prisma.payout.findUnique({
    where: {
      id,
    },
    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          ownerId: true,
        },
      },
      booking: {
        include: {
          service: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function findPayoutByBookingId(bookingId) {
  return prisma.payout.findUnique({
    where: {
      bookingId,
    },
    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          ownerId: true,
        },
      },
      booking: {
        include: {
          service: true,
        },
      },
    },
  });
}

export async function findPayoutsByVendor(
  vendorId,
  { skip, take, status }
) {
  const where = {
    vendorId,
    ...(status && { status }),
  };

  const [payouts, total] = await Promise.all([
    prisma.payout.findMany({
      where,
      skip,
      take,
      include: {
        booking: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.payout.count({
      where,
    }),
  ]);

  return {
    payouts,
    total,
  };
}

export async function findAllPayouts({
  skip,
  take,
  status,
}) {
  const where = {
    ...(status && { status }),
  };

  const [payouts, total] = await Promise.all([
    prisma.payout.findMany({
      where,
      skip,
      take,
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            ownerId: true,
          },
        },
        booking: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.payout.count({
      where,
    }),
  ]);

  return {
    payouts,
    total,
  };
}

export async function updatePayout(id, data) {
  return prisma.payout.update({
    where: {
      id,
    },
    data,
    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          ownerId: true,
        },
      },
      booking: {
        include: {
          service: true,
        },
      },
    },
  });
}