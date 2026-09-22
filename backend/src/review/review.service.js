import prisma from "../config/prisma.js";

import {
  createReview,
  findReviewById,
  findReviewByBookingId,
  findReviewsByCustomer,
  findReviewsByService,
  findAllReviews,
  updateReview,
  deleteReview,
} from "../repositories/review.repository.js";

/**
 * Create a review for a completed booking
 */
export const createReviewService = async (customerId, data) => {
  const { bookingId, rating, comment } = data;

  // 1. Find the booking
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

  // 2. Make sure the booking belongs to the logged-in customer
  if (booking.customerId !== customerId) {
    throw new Error(
      "You are not authorized to review this booking"
    );
  }

  // 3. Only completed bookings can be reviewed
  if (booking.status !== "COMPLETED") {
    throw new Error(
      "Only completed bookings can be reviewed"
    );
  }

  // 4. Make sure the service is still valid
  if (!booking.service) {
    throw new Error("Service associated with booking not found");
  }

  // 5. Check if this booking already has a review
  const existingReview = await findReviewByBookingId(bookingId);

  if (existingReview) {
    throw new Error(
      "A review already exists for this booking"
    );
  }

  // 6. Create the review using server-controlled values
  return createReview({
    customerId,
    serviceId: booking.serviceId,
    bookingId,
    rating,
    comment,
  });
};

/**
 * Get a review by ID
 */
export const getReviewByIdService = async (
  reviewId,
  userId,
  role
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Customers can only view their own review directly
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

/**
 * Get customer's reviews
 */
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

/**
 * Get reviews for a service
 */
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

/**
 * Get all reviews
 * Admin / Support
 */
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

/**
 * Update customer's review
 */
export const updateReviewService = async (
  reviewId,
  customerId,
  data
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Make sure the review belongs to the customer
  if (review.customer.id !== customerId) {
    throw new Error(
      "You are not authorized to update this review"
    );
  }

  // Only update fields supplied by the customer
  const updateData = {};

  if (data.rating !== undefined) {
    updateData.rating = data.rating;
  }

  if (data.comment !== undefined) {
    updateData.comment = data.comment;
  }

  // If a moderated review is edited, require it to be
  // reviewed again by moderation.
  updateData.isApproved = true;
  updateData.isVisible = true;

  return updateReview(reviewId, updateData);
};

/**
 * Delete customer's review
 */
export const deleteReviewService = async (
  reviewId,
  customerId,
  role
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Admin / Support can delete directly
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

/**
 * Moderate a review
 */
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