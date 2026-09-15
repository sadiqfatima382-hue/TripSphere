import prisma from "../config/prisma.js";

export async function createBooking(data) {
  return prisma.booking.create({
    data,
    include: {
      service: {
        include: {
          category: true,
        },
      },
      vendor: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findBookingById(id) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      vendor: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findBookingByBookingNumber(bookingNumber) {
  return prisma.booking.findUnique({
    where: { bookingNumber },
    include: {
      service: {
        include: {
          category: true,
        },
      },
      vendor: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findBookingsByCustomer({
  customerId,
  skip,
  take,
  status,
}) {
  const where = {
    customerId,
    ...(status && { status }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        vendor: true,
      },
    }),

    prisma.booking.count({
      where,
    }),
  ]);

  return {
    bookings,
    total,
  };
}

export async function findBookingsByVendor({
  vendorId,
  skip,
  take,
  status,
}) {
  const where = {
    vendorId,
    ...(status && { status }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),

    prisma.booking.count({
      where,
    }),
  ]);

  return {
    bookings,
    total,
  };
}

export async function findAllBookings({
  skip,
  take,
  status,
  serviceId,
  vendorId,
  customerId,
}) {
  const where = {
    ...(status && { status }),
    ...(serviceId && { serviceId }),
    ...(vendorId && { vendorId }),
    ...(customerId && { customerId }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        vendor: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),

    prisma.booking.count({
      where,
    }),
  ]);

  return {
    bookings,
    total,
  };
}

export async function updateBooking(id, data) {
  return prisma.booking.update({
    where: { id },
    data,
    include: {
      service: {
        include: {
          category: true,
        },
      },
      vendor: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteBooking(id) {
  return prisma.booking.delete({
    where: { id },
  });
}