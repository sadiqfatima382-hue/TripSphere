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
  if (vendor.status === "SUSPENDED"){ 
    throw new Error("Suspend vendor cannot update profile")
  }
  return updateVendor(vendor.id, data)

}

export async function getVendorService({page, limit,status, search})
{const skip = (page-1)*limit;
  const result = await findAllVendors({skip, take:limit, status, search})

  
  return {
    vendors: result.vendors,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

export async function approveVendorService(id) {
  const vendor = await findVendorById (id)
  if(!vendor){
    throw new Error("Vendor Profile not Found")
  }

  if (vendor.status==="APPROVED"){
    throw new Error ("Vendor is already approved")
  }

   if (vendor.status === "SUSPENDED") {
    throw new Error(
      "Suspended vendor cannot be approved directly"
    );
   }

     return updateVendor(id, {
    status: "APPROVED",
    isActive: true,
  });
}

export async function rejectVendorService(id) {
  const vendor = await findVendorById(id);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status === "APPROVED") {
    throw new Error(
      "Approved vendor cannot be rejected"
    );
  }

  return updateVendor(id, {
    status: "REJECTED",
    isActive: false,
  });
}

export async function suspendVendorService(id) {
  const vendor = await findVendorById(id);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status === "SUSPENDED") {
    throw new Error("Vendor is already suspended");
  }

  return updateVendor(id, {
    status: "SUSPENDED",
    isActive: false,
  });
}