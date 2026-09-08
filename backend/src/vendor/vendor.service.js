import { createVendor, findVendorById, findVendorByOwnerId, findVendorBySlug, findAllVendors, updateVendor } from "./vendor.repository.js";
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

export async function getVendorByIdService(id) {
  const vendor = await findVendorById(id)
  if (!vendor) {
    throw new Error("Vendor not found")
  }
  return vendor
}

export async function getOwnVendorService(ownerId) {
  const vendor = await findVendorByOwnerId(ownerId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return vendor;
}

export async function updateOwnVendorService(ownerId, data) {
  const vendor = await findVendorByOwnerId(ownerId)
  if (!vendor) {
    throw new Error("Vendor Profile Not Found")
  }
  if (vendor.status === "SUSPENDED")
    throw new Error("Suspende error cannot update profile")
  return updateVendor(vendor.id, data)

}