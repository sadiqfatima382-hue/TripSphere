import prisma from "../config/prisma.js";

export const searchServices = async ({
  search,
  categoryId,
  country,
  city,
  minPrice,
  maxPrice,
  minRating,
  minBookingHours,
  maxBookingHours,
  skip,
  take,
  sortBy,
}) => {
  const where = {
    status: "APPROVED",
    isActive: true,
  };
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
  if (categoryId) {
    where.categoryId = categoryId;
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

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};

    if (minPrice !== undefined) {
      where.basePrice.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.basePrice.lte = maxPrice;
    }
  }

  if (
    minBookingHours !== undefined ||
    maxBookingHours !== undefined
  ) {
    where.minBookingHours = {};

    if (minBookingHours !== undefined) {
      where.minBookingHours.gte = minBookingHours;
    }

    if (maxBookingHours !== undefined) {
      where.minBookingHours.lte = maxBookingHours;
    }
  }

  if (minRating !== undefined) {
    where.reviews = {
      some: {
        isApproved: true,
        isVisible: true,
        rating: {
          gte: minRating,
        },
      },
    };
  }

  let orderBy = {
    createdAt: "desc",
  };

  switch (sortBy) {
    case "price_asc":
      orderBy = {
        basePrice: "asc",
      };
      break;

    case "price_desc":
      orderBy = {
        basePrice: "desc",
      };
      break;

    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;

    case "rating":
      orderBy = {
        reviews: {
          _count: "desc",
        },
      };
      break;

    case "newest":
    default:
      orderBy = {
        createdAt: "desc",
      };
      break;
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take,

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        vendor: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            city: true,
            country: true,
            status: true,
          },
        },

        reviews: {
          where: {
            isApproved: true,
            isVisible: true,
          },
          select: {
            rating: true,
          },
        },
      },

      orderBy,
    }),

    prisma.service.count({
      where,
    }),
  ]);

  return {
    services,
    total,
  };
};

