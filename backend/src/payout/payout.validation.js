import { z } from "zod";

export const createPayoutSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),

  method: z.enum(
    ["BANK_TRANSFER", "STRIPE", "CASH"],
    {
      error: "Invalid payout method",
    }
  ),
});