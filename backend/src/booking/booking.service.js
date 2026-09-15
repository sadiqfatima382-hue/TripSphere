import { createBooking, findAllBookings, findBookingByBookingNumber,findBookingById, findBookingsByCustomer, findBookingsByVendor,updateBooking,deleteBooking } from "./booking.repository.js";
import prisma from "../config/prisma.js";
import { date } from "zod";

function generateBookingNumber() {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000)
}

export async function createBookingService(customerId, data) {
  const {    serviceId,    startDate,    endDate,    quantity,    customerNote,  } = data;

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      vendor: true,
      category: true,
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
    throw new Error("Vendor is not available");
  }

  if (startDate < new Date()) {
    throw new Error("Booking start date cannot be in the past");
  }

  if (endDate && endDate < startDate) {
    throw new Error(
      "End date must be greater than or equal to start date"
    );
  }

  const unitPrice = Number(service.basePrice);
  const totalPrice = unitPrice * quantity;

  const bookingNumber = generateBookingNumber();

  const booking = await createBooking({
    bookingNumber,
    customerId,
    serviceId,
    vendorId: service.vendorId,

    startDate,
    endDate,

    quantity,

    unitPrice,
    totalPrice,
    currency: service.currency,

    status: "PENDING",

    customerNote,
  });

  return booking;
}

export async function getBookingByIdService(id) {
  const booking = await findBookingById(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
}

export async function getBookingByNumberService(bookingNumber) {
  const booking = await findBookingByBookingNumber(
    bookingNumber
  );

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
}

export async function getCustomerBookingsService(
  customerId,
  query
) {
  const {
    page,
    limit,
    status,
  } = query;

  const skip = (page - 1) * limit;

  const { bookings, total } =
    await findBookingsByCustomer({
      customerId,
      skip,
      take: limit,
      status,
    });

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}  

export async function getVendorBookingsService(
  vendorId,
  query
) {
  const {
    page,
    limit,
    status,
  } = query;

  const skip = (page - 1) * limit;

  const { bookings, total } =
    await findBookingsByVendor({
      vendorId,
      skip,
      take: limit,
      status,
    });

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAllBookingsService(query) {
  const {
    page,
    limit,
    status,
    serviceId,
    vendorId,
    customerId,
  } = query;

  const skip = (page - 1) * limit;

  const { bookings, total } =
    await findAllBookings({
      skip,
      take: limit,
      status,
      serviceId,
      vendorId,
      customerId,
    });

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function confirmBookingService(
  bookingId,
  vendorId
) {
  const booking = await findBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.vendorId !== vendorId) {
    throw new Error(
      "You are not authorized to confirm this booking"
    );
  }

  if (booking.status !== "PENDING") {
    throw new Error(
      "Only pending bookings can be confirmed"
    );
  }

  return updateBooking(bookingId, {
    status: "CONFIRMED",
  });
}

export async function cancelBookingService(
  bookingId,
  customerId,
  reason
) {
  const booking = await findBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error(
      "You are not authorized to cancel this booking"
    );
  }

  if (
    booking.status !== "PENDING" &&
    booking.status !== "CONFIRMED"
  ) {
    throw new Error(
      "This booking cannot be cancelled"
    );
  }

  return updateBooking(bookingId, {
    status: "CANCELLED",
    customerNote: reason
      ? `${booking.customerNote || ""}\nCancellation reason: ${reason}`.trim()
      : booking.customerNote,
  });
}

export async function completeBookingService(
  bookingId,
  vendorId
) {
  const booking = await findBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.vendorId !== vendorId) {
    throw new Error(
      "You are not authorized to complete this booking"
    );
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error(
      "Only confirmed bookings can be completed"
    );
  }

  return updateBooking(bookingId, {
    status: "COMPLETED",
  });
}

export async function deleteBookingService(id) {
  const booking = await findBookingById(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (
    booking.status === "CONFIRMED" ||
    booking.status === "COMPLETED"
  ) {
    throw new Error(
      "Confirmed or completed bookings cannot be deleted"
    );
  }

  return deleteBooking(id);
}