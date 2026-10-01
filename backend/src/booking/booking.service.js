import { createBooking, findAllBookings, findBookingByBookingNumber, findBookingById, findBookingsByCustomer, findBookingsByVendor, updateBooking, deleteBooking } from "./booking.repository.js";
import prisma from "../config/prisma.js";
import { checkAvailabilityService } from "../availability/availability.service.js";
import {bookingCreatedTemplate, bookingConfirmedTemplate , bookingCancelledTemplate, vendorNewBookingTemplate} from "../templates/email.template.js"
import {sendEmail} from "../email/email.service.js"

function generateBookingNumber() {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `TS-${timestamp}-${random}`;
}

export async function createBookingService(customerId, data) {
  const { serviceId, startDate, endDate, quantity, customerNote, } = data;

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

   if (!endDate) {
    throw new Error(
      "End date is required to check booking availability"
    );
  }
const availability = await checkAvailabilityService({
  serviceId: data.serviceId,
  startDate: data.startDate,
  endDate: data.endDate,
});

if (!availability.available) {
  throw new Error(
    "Service is not available for the selected time"
  );
}

const customer = await prisma.user.findUnique({
  where: {id: customerId},
  select: {
    firstName: true,
    lastName:true ,
    email: true,
  }
});
if (!customer){
  throw new Error("Customer not found")
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

const email = bookingCreatedTemplate({
  customerName: `${customer.firstName} ${customer.lastName}`,
  bookingNumber: booking.bookingNumber,
  serviceName: service.name,
  startDate: booking.startDate,
  endDate: booking.endDate,
  totalPrice: booking.totalPrice,
  currency: booking.currency,
});

await sendEmail({
  to: customer.email,
  subject: email.subject,
  text: email.text,
  html: email.html,
});

const vendorEmail = vendorNewBookingTemplate({
  vendorName: service.vendor.businessName,

  bookingNumber: booking.bookingNumber,

  customerName: `${customer.firstName} ${customer.lastName}`,

  serviceName: service.name,

  startDate: booking.startDate,

  endDate: booking.endDate,

  quantity: booking.quantity,

  totalPrice: booking.totalPrice,

  currency: booking.currency,
});
console.log("Vendor notification:", {
  vendorName: service.vendor.businessName,
  vendorEmail: service.vendor.email,
});
await sendEmail({
  to: service.vendor.email,

  subject: vendorEmail.subject,

  text: vendorEmail.text,

  html: vendorEmail.html,
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

  const { bookings, total } = await findAllBookings({
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

  const updatedBooking = await updateBooking(bookingId, {
    status: "CONFIRMED",
  });

  const customer = await prisma.user.findUnique({
    where: {
      id: booking.customerId,
    },

    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const email = bookingConfirmedTemplate({
    customerName: `${customer.firstName} ${customer.lastName}`,
    bookingNumber: updatedBooking.bookingNumber,
    serviceName: booking.service.name,
    startDate: updatedBooking.startDate,
    endDate: updatedBooking.endDate,
    totalPrice: updatedBooking.totalPrice,
    currency: updatedBooking.currency,
  });

  await sendEmail({
    to: customer.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return updatedBooking;
}

export async function cancelBookingService(
  bookingId,
  userId
) {
  const booking = await findBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Keep your existing authorization checks here

  if (booking.status === "CANCELLED") {
    throw new Error("Booking is already cancelled");
  }

  if (booking.status === "COMPLETED") {
    throw new Error(
      "Completed booking cannot be cancelled"
    );
  }

  const cancellationReason =
    "Booking cancelled by customer";

  const updatedBooking = await updateBooking(
    bookingId,
    {
      status: "CANCELLED",
    }
  );

  const customer = await prisma.user.findUnique({
    where: {
      id: booking.customerId,
    },

    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const email = bookingCancelledTemplate({
    customerName: `${customer.firstName} ${customer.lastName}`,

    bookingNumber: updatedBooking.bookingNumber,

    serviceName: booking.service.name,

    cancellationReason,
  });

  await sendEmail({
    to: customer.email,

    subject: email.subject,

    text: email.text,

    html: email.html,
  });

  return updatedBooking;
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