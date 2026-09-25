
import { z } from "zod";

export const checkAvailabilitySchema = z
  .object({
    startDate: z.coerce.date({
      error: "Start date is required",
    }),

    endDate: z.coerce.date({
      error: "End date is required",
    }),
  })
  .refine(
    (data) => data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => data.startDate > new Date(),
    {
      message: "Start date must be in the future",
      path: ["startDate"],
    }
  );