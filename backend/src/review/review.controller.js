import { createReviewService, getReviewByIdService, getCustomerReviewsService, getServiceReviewsService, getAllReviewsService, updateReviewService, deleteReviewService, moderateReviewService, } from "../services/review.service.js";

export const createReview = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        const review = await createReviewService(
            customerId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const getReviewById = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user.id;
        const role = req.user.role;

        const review = await getReviewByIdService(
            reviewId,
            userId,
            role
        );

        return res.status(200).json({
            success: true,
            message: "Review retrieved successfully",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const getCustomerReviews = async (
    req,
    res,
    next
) => {
    try {
        const customerId = req.user.id;

        const result = await getCustomerReviewsService(
            customerId,
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Customer reviews retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const getServiceReviews = async (
    req,
    res,
    next
) => {
    try {
        const serviceId = req.params.serviceId;

        const result = await getServiceReviewsService(
            serviceId,
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Service reviews retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const getAllReviews = async (req, res, next) => {
    try {
        const result = await getAllReviewsService(
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const updateReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const customerId = req.user.id;

        const review = await updateReviewService(
            reviewId,
            customerId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const customerId = req.user.id;
        const role = req.user.role;

        const review = await deleteReviewService(
            reviewId,
            customerId,
            role
        );

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const moderateReview = async (
    req,
    res,
    next
) => {
    try {
        const reviewId = req.params.id;

        const review = await moderateReviewService(
            reviewId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Review moderated successfully",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    };
}