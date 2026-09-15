import { z } from "zod";

export const createBookingSchema = z
  .object({
    serviceId: z
      .string()
      .uuid("Invalid service ID"),

    startDate: z.coerce.date({
      error: "Start date is required",
    }),

    endDate: z.coerce.date().optional(),

    quantity: z.coerce
      .number()
      .int("Quantity must be a whole number")
      .positive("Quantity must be greater than 0")
      .default(1),

    customerNote: z
      .string()
      .trim()
      .max(1000, "Customer note cannot exceed 1000 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.endDate !== undefined) {
        return data.endDate >= data.startDate;
      }

      return true;
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["endDate"],
    }
  );

  export const bookingQuerySchema = z.object({
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
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ])
    .optional(),

  serviceId: z
    .string()
    .uuid("Invalid service ID")
    .optional(),

  vendorId: z
    .string()
    .uuid("Invalid vendor ID")
    .optional(),
});

export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Cancellation reason must be at least 3 characters")
    .max(
      500,
      "Cancellation reason cannot exceed 500 characters"
    )
    .optional(),
});