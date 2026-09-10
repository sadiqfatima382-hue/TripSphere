import {  createService,  findServiceById,  findServiceBySlug,  findServicesByVendor,  findAllServices,  updateService,  deleteService,} from "./service.repository.js";
import prisma from "../config/prisma.js";
import { generateSlug } from "../utils/slug.js";

export async function getApprovedVendor(ownerId) {
  const vendor = await prisma.vendor.findUnique({
    where: {
      ownerId,
    },
  });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status !== "APPROVED") {
    throw new Error(
      "Only Approved Vendors Can Create Services"
    );
  }

  if (!vendor.isActive) {
    throw new Error("Account inactive");
  }

  return vendor;
}

export async function getActiveCategory(categoryId) {
  const category = await prisma.serviceCategory.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (!category.isActive) {
    throw new Error("Service Category is inactive");
  }

  return category;
}


export async function generateUniqueServiceSlug(name) {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (await findServiceBySlug(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function createServiceService(
  ownerId,
  categoryId,
  data
) {
  
  const vendor = await getApprovedVendor(ownerId);

  await getActiveCategory(categoryId);

  const slug = await generateUniqueServiceSlug(data.name);

  return createService({
    vendorId: vendor.id,
    categoryId,
    name: data.name,
    slug,
    description: data.description,
    basePrice: data.basePrice,
    currency: data.currency,
    country: data.country,
    city: data.city,
    address: data.address,
    minBookingHours: data.minBookingHours,
    maxBookingHours: data.maxBookingHours,

    status: "DRAFT",
    isActive: false,
  });
}

export async function getServicebyIdService(id) {
  const service = await findServiceById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
}

export async function getOwnServiceService(
  vendorId,
  serviceId
) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.vendorId !== vendorId) {
    throw new Error(
      "You are not authorized to access this service"
    );
  }

  return service;
}

export async function getVendorServicesService({
  vendorId,
  page,
  limit,
  status,
}) {
  const skip = (page - 1) * limit;

  const result = await findServicesByVendor({
    vendorId,
    skip,
    take: limit,
    status,
  });

  return {
    services: result.services,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

export async function getServicesService({
  page,
  limit,
  categoryId,
  vendorId,
  status,
  country,
  city,
  search,
}) {
  const skip = (page - 1) * limit;

  const result = await findAllServices({
    skip,
    take: limit,
    categoryId,
    vendorId,
    status,
    country,
    city,
    search,
  });

  return {
    services: result.services,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

export async function updateOwnServiceService(
  vendorId,
  serviceId,
  data
) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.vendorId !== vendorId) {
    throw new Error(
      "You are not authorized to update this service"
    );
  }

  if (service.status === "SUSPENDED") {
    throw new Error(
      "Suspended service cannot be updated"
    );
  }

  if (data.categoryId) {
    await getActiveCategory(data.categoryId);
  }

  const updateData = {
    ...data,
  };

  delete updateData.vendorId;
  delete updateData.status;
  delete updateData.isActive;
  delete updateData.slug;

  if (data.name && data.name !== service.name) {
    updateData.slug = await generateUniqueServiceSlug(
      data.name
    );
  }

  return updateService(serviceId, updateData);
}

export async function deleteOwnServiceService(
  vendorId,
  serviceId
) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.vendorId !== vendorId) {
    throw new Error(
      "You are not authorized to delete this service"
    );
  }

  if (service.status === "APPROVED") {
    throw new Error(
      "Approved services cannot be permanently deleted"
    );
  }

  return deleteService(serviceId);
}

