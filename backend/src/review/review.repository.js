import prisma from "../config/prisma.js";

export const createReview = async (data) => {
  return prisma.review.create({
    data,
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      booking: {
        select: {
          id: true,
          bookingNumber: true,
          status: true,
        },
      },
    },
  });
};

export const findReviewById = async (id) => {
  return prisma.review.findUnique({
    where: {
      id,
    },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      booking: {
        select: {
          id: true,
          bookingNumber: true,
          status: true,
        },
      },
    },
  });
};

export const findReviewByBookingId = async (bookingId) => {
  return prisma.review.findUnique({
    where: {
      bookingId,
    },
  });
};

export const findReviewsByCustomer = async ({
  customerId,
  skip,
  take,
  rating,
}) => {
  const where = {
    customerId,
    ...(rating !== undefined && { rating }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            status: true,
          },
        },
      },
    }),

    prisma.review.count({
      where,
    }),
  ]);

  return {
    reviews,
    total,
  };
};

export const findReviewsByService = async ({
  serviceId,
  skip,
  take,
  rating,
}) => {
  const where = {
    serviceId,
    isApproved: true,
    isVisible: true,
    ...(rating !== undefined && { rating }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    prisma.review.count({
      where,
    }),
  ]);

  return {
    reviews,
    total,
  };
};

export const findAllReviews = async ({
  skip,
  take,
  serviceId,
  customerId,
  rating,
  isApproved,
  isVisible,
}) => {
  const where = {
    ...(serviceId && { serviceId }),
    ...(customerId && { customerId }),
    ...(rating !== undefined && { rating }),
    ...(isApproved !== undefined && { isApproved }),
    ...(isVisible !== undefined && { isVisible }),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            status: true,
          },
        },
      },
    }),

    prisma.review.count({
      where,
    }),
  ]);

  return {
    reviews,
    total,
  };
};

export const updateReview = async (id, data) => {
  return prisma.review.update({
    where: {
      id,
    },
    data,
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      booking: {
        select: {
          id: true,
          bookingNumber: true,
          status: true,
        },
      },
    },
  });
};

export const deleteReview = async (id) => {
  return prisma.review.delete({
    where: {
      id,
    },
  });
};