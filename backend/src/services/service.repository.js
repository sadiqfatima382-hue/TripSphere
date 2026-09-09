import prisma from "../config/prisma.js";

export async function createService(data) {
  return prisma.service.create({
    data,

    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          status: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function findServiceById(id) {
  return prisma.service.findUnique({
    where: {
      id,
    },

    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          status: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function findServiceBySlug(slug) {
  return prisma.service.findUnique({
    where: {
      slug,
    },

    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          status: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function findServicesByVendor({
  vendorId,
  skip,
  take,
  status,
}) {
  const where = {
    vendorId,
  };

  if (status) {
    where.status = status;
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),

    prisma.service.count({
      where,
    }),
  ]);

  return {
    services,
    total,
  };
}

export async function findAllServices({
  skip,
  take,
  categoryId,
  vendorId,
  status,
  country,
  city,
  search,
}) {
  const where = {};



  if (categoryId) {
    where.categoryId = categoryId;
  }



  if (vendorId) {
    where.vendorId = vendorId;
  }


  if (status) {
    where.status = status;
  }



  if (country) {
    where.country = {
      equals: country,
      mode: "insensitive",
    };
  }


  if (city) {
    where.city = {
      equals: city,
      mode: "insensitive",
    };
  }


  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            status: true,
          },
        },

        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),

    prisma.service.count({
      where,
    }),
  ]);

  return {
    services,
    total,
  };
}

export async function updateService(id, data) {
  return prisma.service.update({
    where: {
      id,
    },

    data,

    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          status: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function deleteService(id) {
  return prisma.service.delete({
    where: {
      id,
    },
  });
}