
import prisma from "../config/prisma.js";
import { findOverlappingBookings } from "./availability.repository.js";

export async function checkAvailabilityService({
  serviceId,
  startDate,
  endDate,
}) {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      vendor: {
        select: {
          id: true,
          status: true,
          isActive: true,
        },
      },
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  if (service.status !== "APPROVED" || !service.isActive) {
    throw new Error("Service is not available for booking");
  }

  if (
    service.vendor.status !== "APPROVED" ||
    !service.vendor.isActive
  ) {
    throw new Error("Vendor is not available for booking");
  }

  const overlappingBookings = await findOverlappingBookings({
    serviceId,
    startDate,
    endDate,
  });

  const available = overlappingBookings.length === 0;

  return {
    serviceId,
    startDate,
    endDate,
    available,
    message: available
      ? "Service is available for the selected time"
      : "Service is not available for the selected time",
  };
} 