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

  // 🔍 Keyword search
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

  // 🏷️ Category filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // 🌍 Country filter
  if (country) {
    where.country = {
      equals: country,
      mode: "insensitive",
    };
  }

  // 🏙️ City filter
  if (city) {
    where.city = {
      equals: city,
      mode: "insensitive",
    };
  }

  // 💰 Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};

    if (minPrice !== undefined) {
      where.basePrice.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.basePrice.lte = maxPrice;
    }
  }

  // ⏱️ Booking hours filter
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

  // ⭐ Average rating filter
  if (minRating !== undefined) {
    where.averageRating = {
      gte: minRating,
    };
  }

  // ↕️ Sorting
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
        averageRating: "desc",
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

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,

        basePrice: true,
        currency: true,

        country: true,
        city: true,
        address: true,

        minBookingHours: true,
        maxBookingHours: true,

        status: true,
        isActive: true,

        averageRating: true,
        reviewCount: true,

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

