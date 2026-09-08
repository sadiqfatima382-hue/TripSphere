import prisma from "../config/prisma.js";

export async function createVendor(data) {
  return prisma.vendor.create({
    data,
    include: {
      owner: {
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

export async function findVendorByOwnerId(ownerId) {
  return prisma.vendor.findUnique({
    where: {
      ownerId,
    },
    include: {
      owner: {
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

export async function findVendorById(id) {
  return prisma.vendor.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
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

export async function findVendorBySlug(slug) {
  return prisma.vendor.findUnique({
    where: {
      slug,
    },
  });
}

export async function findAllVendors({
  skip,
  take,
  status,
  search,
}) {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      {
        businessName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        city: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        country: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),

    prisma.vendor.count({
      where,
    }),
  ]);

  return {
    vendors,
    total,
  };
}

export async function updateVendor(id, data) {
  return prisma.vendor.update({
    where: {
      id,
    },
    data,
    include: {
      owner: {
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