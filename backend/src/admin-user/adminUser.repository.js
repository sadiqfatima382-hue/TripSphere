import prisma from "../config/prisma.js";

export async function findAllUsers({
  skip = 0,
  take = 10,
  search,
  role,
  isActive,
} = {}) {
  const where = {
    ...(search
      ? {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
      : {}),
    ...(role
      ? {
        role: {
          name: role,
        },
      }
      : {}),
    ...(isActive !== undefined ? { isActive } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
  };
}

export async function findUserById(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
      vendor: {
        select: {
          id: true,
          businessName: true,
          status: true,
        },
      },
    },
  });
}

export async function updateUserStatus(userId, isActive) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function countActiveAdmins() {
  return prisma.user.count({
    where: {
      isActive: true,
      role: {
        name: "ADMIN",
      },
    },
  });
}

export async function findRoleByName(roleName) {
  return prisma.role.findUnique({
    where: {
      name: roleName,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function updateUserRole(userId, roleId) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roleId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findUserBookingHistory(
  userId,
  { skip = 0, take = 10 } = {}
) {
  const where = {
    customerId: userId,
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
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
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            method: true,
            status: true,
            paidAt: true,
          },
        },
      },
    }),

    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    total,
  };
}


