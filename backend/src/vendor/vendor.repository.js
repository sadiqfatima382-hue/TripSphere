import prisma from "../config/prisma.js";

export async function createVendor(data) {
  return prisma.vendor.create({
    data,
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findVendorByOwnerId(ownerId) {
  return prisma.vendor.findUnique({
    where: {
      ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findVendorById(id) {
  return prisma.vendor.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

export async function findVendorBySlug(slug) {
  return prisma.vendor.findUnique({
    where: {
      slug,
    },
  });
}