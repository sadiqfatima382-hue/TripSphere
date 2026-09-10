import { z } from "zod";

export const createServiceSchema = z.object({
  categoryId: z
    .string()
    .uuid("Invalid service category ID"),

  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(150, "Service name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  basePrice: z
    .coerce
    .number()
    .positive("Base price must be greater than 0"),

  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter code")
    .transform((value) => value.toUpperCase()),

  country: z
    .string()
    .trim()
    .max(100, "Country cannot exceed 100 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City cannot exceed 100 characters")
    .optional(),

  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  minBookingHours: z
    .coerce
    .number()
    .int("Minimum booking hours must be an integer")
    .positive("Minimum booking hours must be greater than 0")
    .optional(),

  maxBookingHours: z
    .coerce
    .number()
    .int("Maximum booking hours must be an integer")
    .positive("Maximum booking hours must be greater than 0")
    .optional(),
})
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

export const updateServiceSchema = z.object({
  categoryId: z
    .string()
    .uuid("Invalid service category ID")
    .optional(),

  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(150, "Service name cannot exceed 150 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  basePrice: z
    .coerce
    .number()
    .positive("Base price must be greater than 0")
    .optional(),

  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter code")
    .transform((value) => value.toUpperCase())
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, "Country cannot exceed 100 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City cannot exceed 100 characters")
    .optional(),

  address: z
    .string()
    .trim()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),

  minBookingHours: z
    .coerce
    .number()
    .int("Minimum booking hours must be an integer")
    .positive("Minimum booking hours must be greater than 0")
    .optional(),

  maxBookingHours: z
    .coerce
    .number()
    .int("Maximum booking hours must be an integer")
    .positive("Maximum booking hours must be greater than 0")
    .optional(),
})
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

export const serviceQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  categoryId: z
    .string()
    .uuid("Invalid service category ID")
    .optional(),

  vendorId: z
    .string()
    .uuid("Invalid vendor ID")
    .optional(),

  status: z
    .enum([
      "DRAFT",
      "PENDING",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
    ])
    .optional(),

  country: z
    .string()
    .trim()
    .optional(),

  city: z
    .string()
    .trim()
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),
});