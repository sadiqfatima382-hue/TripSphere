import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),

  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),

  comment: z
    .string()
    .trim()
    .max(2000, "Comment cannot exceed 2000 characters")
    .optional(),
});

export const updateReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5")
    .optional(),

  comment: z
    .string()
    .trim()
    .max(2000, "Comment cannot exceed 2000 characters")
    .optional(),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  serviceId: z.string().uuid("Invalid service ID").optional(),

  customerId: z.string().uuid("Invalid customer ID").optional(),

  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .optional(),

  isApproved: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  isVisible: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});
export const moderateReviewSchema = z
  .object({
    isApproved: z.boolean().optional(),
    isVisible: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.isApproved !== undefined ||
      data.isVisible !== undefined,
    {
      message: "At least one moderation field is required",
    }
  );