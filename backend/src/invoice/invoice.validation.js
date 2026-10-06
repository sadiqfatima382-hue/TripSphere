import { z } from "zod";

export const createInvoiceSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});