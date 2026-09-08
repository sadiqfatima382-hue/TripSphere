import { z } from "zod";

export const createVendorSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(100),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid vendor email")
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .optional(),

  website: z
    .string()
    .trim()
    .url("Invalid website URL")
    .optional(),

  country: z
    .string()
    .trim()
    .max(100)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  address: z
    .string()
    .trim()
    .max(255)
    .optional(),
});

export const updateVendorSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid vendor email")
    .transform((value) => value.toLowerCase())
    .optional(),

  phone: z
    .string()
    .trim()
    .optional(),

  website: z
    .string()
    .trim()
    .url("Invalid website URL")
    .optional(),

  country: z
    .string()
    .trim()
    .max(100)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  address: z
    .string()
    .trim()
    .max(255)
    .optional(),
});