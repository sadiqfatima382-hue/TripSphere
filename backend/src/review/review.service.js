import prisma from "../config/prisma.js";
import {  createReview,  findReviewById,  findReviewByBookingId,  findReviewsByCustomer,  findReviewsByService,  findAllReviews,  updateReview,  deleteReview,} from "../review/review.repository.js";

export const createReviewService = async (customerId, data) => {
  const { bookingId, rating, comment } = data;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: {
        include: {
          vendor: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error(
      "You are not authorized to review this booking"
    );
  }

  if (booking.status !== "COMPLETED") {
    throw new Error(
      "Only completed bookings can be reviewed"
    );
  }

  if (!booking.service) {
    throw new Error("Service associated with booking not found");
  }

  const existingReview = await findReviewByBookingId(bookingId);

  if (existingReview) {
    throw new Error(
      "A review already exists for this booking"
    );
  }

  return createReview({
    customerId,
    serviceId: booking.serviceId,
    bookingId,
    rating,
    comment,
  });
};

export const getReviewByIdService = async (
  reviewId,
  userId,
  role
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (
    role !== "ADMIN" &&
    role !== "SUPPORT" &&
    review.customer.id !== userId
  ) {
    throw new Error(
      "You are not authorized to view this review"
    );
  }

  return review;
};

export const getCustomerReviewsService = async (
  customerId,
  query
) => {
  const {
    page,
    limit,
    rating,
  } = query;

  const skip = (page - 1) * limit;

  const result = await findReviewsByCustomer({
    customerId,
    skip,
    take: limit,
    rating,
  });

  return {
    reviews: result.reviews,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
};

export const getServiceReviewsService = async (
  serviceId,
  query
) => {
  const {
    page,
    limit,
    rating,
  } = query;

  const skip = (page - 1) * limit;

  const result = await findReviewsByService({
    serviceId,
    skip,
    take: limit,
    rating,
  });

  return {
    reviews: result.reviews,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
};

export const getAllReviewsService = async (query) => {
  const {
    page,
    limit,
    serviceId,
    customerId,
    rating,
    isApproved,
    isVisible,
  } = query;

  const skip = (page - 1) * limit;

  const result = await findAllReviews({
    skip,
    take: limit,
    serviceId,
    customerId,
    rating,
    isApproved,
    isVisible,
  });

  return {
    reviews: result.reviews,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
};

export const updateReviewService = async (
  reviewId,
  customerId,
  data
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.customer.id !== customerId) {
    throw new Error(
      "You are not authorized to update this review"
    );
  }

  const updateData = {};

  if (data.rating !== undefined) {
    updateData.rating = data.rating;
  }

  if (data.comment !== undefined) {
    updateData.comment = data.comment;
  }

  updateData.isApproved = true;
  updateData.isVisible = true;

  return updateReview(reviewId, updateData);
};

export const deleteReviewService = async (
  reviewId,
  customerId,
  role
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }
  if (
    role !== "ADMIN" &&
    role !== "SUPPORT" &&
    review.customer.id !== customerId
  ) {
    throw new Error(
      "You are not authorized to delete this review"
    );
  }

  return deleteReview(reviewId);
};

export const moderateReviewService = async (
  reviewId,
  data
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  const updateData = {};

  if (data.isApproved !== undefined) {
    updateData.isApproved = data.isApproved;
  }

  if (data.isVisible !== undefined) {
    updateData.isVisible = data.isVisible;
  }

  return updateReview(reviewId, updateData);
};