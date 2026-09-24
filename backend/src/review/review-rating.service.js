import prisma from "../config/prisma.js";

export const recalculateServiceRating = async (serviceId) => {
  const ratingSummary = await prisma.review.aggregate({
    where: {
      serviceId,
      isApproved: true,
      isVisible: true,
    },

    _avg: {
      rating: true,
    },

    _count: {
      rating: true,
    },
  });

  const averageRating = ratingSummary._avg.rating ?? 0;
  const reviewCount = ratingSummary._count.rating;

  await prisma.service.update({
    where: {
      id: serviceId,
    },

    data: {
      averageRating,
      reviewCount,
    },
  });

  return {
    averageRating,
    reviewCount,
  };
};

