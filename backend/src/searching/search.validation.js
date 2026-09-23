import { z } from "zod";

export const serviceSearchSchema = z.object({
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

  search: z
    .string()
    .trim()
    .min(1)
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional(),

  country: z
    .string()
    .trim()
    .optional(),

  city: z
    .string()
    .trim()
    .optional(),

  minPrice: z.coerce
    .number()
    .nonnegative("Minimum price cannot be negative")
    .optional(),

  maxPrice: z.coerce
    .number()
    .nonnegative("Maximum price cannot be negative")
    .optional(),

  minRating: z.coerce
    .number()
    .min(1)
    .max(5)
    .optional(),

  sortBy: z
    .enum([
      "price_asc",
      "price_desc",
      "newest",
      "oldest",
      "rating",
    ])
    .default("newest"),

  minBookingHours: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  maxBookingHours: z.coerce
    .number()
    .int()
    .positive()
    .optional(),
})
  .refine(
    (data) => {
      if (
        data.minPrice !== undefined &&
        data.maxPrice !== undefined
      ) {
        return data.maxPrice >= data.minPrice;
      }

      return true;
    },
    {
      message:
        "Maximum price must be greater than or equal to minimum price",
      path: ["maxPrice"],
    }
  )
  .refine(
    (data) => {
      if (
        data.minBookingHours !== undefined &&
        data.maxBookingHours !== undefined
      ) {
        return data.maxBookingHours >= data.minBookingHours;
      }

      return true;
    },
    {
      message:
        "Maximum booking hours must be greater than or equal to minimum booking hours",
      path: ["maxBookingHours"],
    }
  );