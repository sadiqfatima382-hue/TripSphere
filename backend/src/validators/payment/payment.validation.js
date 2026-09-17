import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z
    .string()
    .uuid("Invalid booking ID"),

  method: z.enum(
    ["STRIPE", "CASH", "BANK_TRANSFER"],
    {
      error: "Invalid payment method",
    }
  ),
});

export const paymentQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  status: z
    .enum([
      "PENDING",
      "PAID",
      "FAILED",
      "REFUNDED",
      "CANCELLED",
    ])
    .optional(),

  method: z
    .enum([
      "STRIPE",
      "CASH",
      "BANK_TRANSFER",
    ])
    .optional(),

  bookingId: z
    .string()
    .uuid("Invalid booking ID")
    .optional(),
});

export const refundPaymentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Refund reason must be at least 3 characters")
    .max(
      500,
      "Refund reason cannot exceed 500 characters"
    )
    .optional(),
});