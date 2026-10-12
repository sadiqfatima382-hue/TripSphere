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

