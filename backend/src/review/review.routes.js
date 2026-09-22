import express from "express";
import { createReview, getReviewById, getCustomerReviews, getServiceReviews, getAllReviews, updateReview, deleteReview, moderateReview, } from "../review/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePermission } from "../middlewares/permission.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReviewSchema, updateReviewSchema, reviewQuerySchema, } from "../review/review.validation.js";

const router = express.Router();

router.post("/", authenticate, authorizePermission("reviews.create"), validate(createReviewSchema), createReview);
router.get("/my-reviews", authenticate, authorizePermission("reviews.create"), validate(reviewQuerySchema, "query"), getCustomerReviews);
router.patch("/:id", authenticate, authorizePermission("reviews.create"), validate(updateReviewSchema), updateReview);
router.delete("/:id", authenticate, authorizePermission("reviews.create"), deleteReview);
router.get("/service/:serviceId", validate(reviewQuerySchema, "query"), getServiceReviews);
router.get("/", authenticate, authorizePermission("reviews.moderate"), validate(reviewQuerySchema, "query"), getAllReviews);
router.patch("/:id/moderate", authenticate, authorizePermission("reviews.moderate"), moderateReview);
router.get("/:id", authenticate, authorizePermission("reviews.create"), getReviewById);

export default router;