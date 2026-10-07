import { z } from "zod";

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Coupon code must be at least 3 characters")
      .max(50, "Coupon code cannot exceed 50 characters")
      .transform((value) => value.toUpperCase()),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    discountType: z.enum(
      ["PERCENTAGE", "FIXED"],
      {
        error: "Discount type must be PERCENTAGE or FIXED",
      }
    ),

    discountValue: z.coerce
      .number()
      .positive("Discount value must be greater than 0"),

    minimumBookingAmount: z.coerce
      .number()
      .nonnegative(
        "Minimum booking amount cannot be negative"
      )
      .optional(),

    maximumDiscountAmount: z.coerce
      .number()
      .positive(
        "Maximum discount amount must be greater than 0"
      )
      .optional(),

    usageLimit: z.coerce
      .number()
      .int("Usage limit must be a whole number")
      .positive("Usage limit must be greater than 0")
      .optional(),

    usageLimitPerCustomer: z.coerce
      .number()
      .int(
        "Customer usage limit must be a whole number"
      )
      .positive(
        "Customer usage limit must be greater than 0"
      )
      .optional(),

    startsAt: z.coerce.date({
      error: "Start date is required",
    }),

    expiresAt: z.coerce.date({
      error: "Expiration date is required",
    }),

    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => data.expiresAt > data.startsAt,
    {
      message: "Expiration date must be after start date",
      path: ["expiresAt"],
    }
  )
  .refine(
    (data) =>
      data.discountType === "PERCENTAGE"
        ? data.discountValue <= 100
        : true,
    {
      message:
        "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  )
  .refine(
    (data) =>
      data.discountType === "FIXED"
        ? data.maximumDiscountAmount === undefined
        : true,
    {
      message:
        "Maximum discount amount is only applicable to percentage discounts",
      path: ["maximumDiscountAmount"],
    }
  );