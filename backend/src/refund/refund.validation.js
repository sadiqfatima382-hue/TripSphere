import { z } from "zod"

export const createRefundSchema = z.object({
    paymentId: z.string().uuid("Invalid payment ID"),

    amount: z.coerce
        .number()
        .positive("Payment amount must be greater than 0"),

    reason: z
        .string()
        .trim()
        .max(500, "Refund Reason cannnot exceed 500 characters")
        .optional()
})

