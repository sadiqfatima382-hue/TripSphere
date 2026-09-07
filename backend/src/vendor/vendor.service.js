import {
  createVendor,
  findVendorById,
  findVendorByOwnerId,
  findVendorBySlug,
} from "./vendor.repository.js";

import { generateSlug } from "../utils/slug.js";

export async function createVendorService(ownerId, data) {
  // Check if owner already has a vendor profile
  const existingVendor = await findVendorByOwnerId(ownerId);

  if (existingVendor) {
    throw new Error("Vendor Profile Already Exists");
  }

  // Generate vendor slug
  let slug = generateSlug(data.businessName);

  // Check if slug already exists
  const existingSlug = await findVendorBySlug(slug);

  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  // Create vendor
  return createVendor({
    ownerId,
    businessName: data.businessName,
    slug,
    description: data.description,
    email: data.email,
    phone: data.phone,
    website: data.website,
    country: data.country,
    city: data.city,
    address: data.address,
  });
}