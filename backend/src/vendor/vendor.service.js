import { createVendor, findVendorById, findVendorByOwnerId, findVendorBySlug } from "./vendor.repository.js";
import {generateSlug} from "../utils/slug.js";

export async function createVendorService(ownerId , data) {
    const existingVendor = await findVendorByOwnerId(ownerId)

    if(!existingVendor){
        throw new Error ("Vendor Profile Alredy Exist")
    }
    
    let Slug = generateSlug(data.businessName)
    const existingSlug = await findVendorBySlug (Slug)

    if (existingSlug) {
    Slug = `${Slug}-${Date.now()}`;
  }

    return createVendor({
    ownerId,
    businessName: data.businessName,
    Slug,
    description: data.description,
    email: data.email,
    phone: data.phone,
    website: data.website,
    country: data.country,
    city: data.city,
    address: data.address,
  });
}
