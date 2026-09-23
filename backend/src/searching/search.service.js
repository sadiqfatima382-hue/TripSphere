import { searchServices } from "../searching/search.repository.js";

export const searchServicesService = async (query) => {
  const {
    page,
    limit,
    search,
    categoryId,
    country,
    city,
    minPrice,
    maxPrice,
    minRating,
    minBookingHours,
    maxBookingHours,
    sortBy,
  } = query;

  // Calculate how many records should be skipped
  const skip = (page - 1) * limit;

  const result = await searchServices({
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
    take: limit,
    sortBy,
  });

  const totalPages = Math.ceil(result.total / limit);

  return {
    services: result.services,

    pagination: {
      page,
      limit,
      total: result.total,
      totalPages,

      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

