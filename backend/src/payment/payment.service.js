import {  createPayment,  findPaymentById,  findPaymentByBookingId,  findPaymentByProviderPaymentId,  findPaymentsByCustomer,  findAllPayments,  updatePayment,  deletePayment,} from "../payment/payment.repository.js";
import prisma from "../config/prisma.js";
import { paymentSuccessfulTemplate, paymentFailedTemplate,} from "../templates/email.template.js";
import { sendNotificationEmail } from "../email/notification.service.js";

export async function createPaymentService(
  customerId,
  data
) {
  const { bookingId, method } = data;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
      vendor: true,
      customer: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error(
      "You are not authorized to pay for this booking"
    );
  }

  if (booking.status !== "PENDING") {
    throw new Error(
      "Payment can only be created for a pending booking"
    );
  }

  if (
    booking.service.status !== "APPROVED" ||
    !booking.service.isActive
  ) {
    throw new Error(
      "The service is no longer available"
    );
  }

  if (
    booking.vendor.status !== "APPROVED" ||
    !booking.vendor.isActive
  ) {
    throw new Error(
      "The vendor is no longer available"
    );
  }

  const existingPayment =
    await findPaymentByBookingId(bookingId);

  if (existingPayment) {
    throw new Error(
      "Payment already exists for this booking"
    );
  }

  const payment = await createPayment({
    bookingId: booking.id,
    customerId: booking.customerId,

    amount: booking.totalPrice,
    currency: booking.currency,

    method,

    status: "PENDING",
  });

  return payment;
}

export async function getPaymentByIdService(
  paymentId,
  userId,
  role
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (
    role === "CUSTOMER" &&
    payment.customer.id !== userId
  ) {
    throw new Error(
      "You are not authorized to view this payment"
    );
  }

  return payment;
}

export async function getCustomerPaymentsService(
  customerId,
  query
) {
  const {
    page,
    limit,
    status,
    method,
    bookingId,
  } = query;

  const skip = (page - 1) * limit;

  const { payments, total } =
    await findPaymentsByCustomer({
      customerId,
      skip,
      take: limit,
      status,
      method,
      bookingId,
    });

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAllPaymentsService(query) {
  const {
    page,
    limit,
    status,
    method,
    bookingId,
    customerId,
  } = query;

  const skip = (page - 1) * limit;

  const { payments, total } =
    await findAllPayments({
      skip,
      take: limit,
      status,
      method,
      bookingId,
      customerId,
    });

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updatePaymentService(
  paymentId,
  data
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  return updatePayment(paymentId, data);
}

export async function markPaymentAsPaidService(
  paymentId,
  transactionId,
  providerPaymentId
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "REFUNDED") {
    throw new Error(
      "Refunded payment cannot be marked as paid"
    );
  }

  if (payment.status === "PAID") {
    if (
      !payment.providerPaymentId ||
      !payment.transactionId
    ) {
      return updatePayment(paymentId, {
        transactionId:
          payment.transactionId || transactionId,

        providerPaymentId:
          payment.providerPaymentId || providerPaymentId,

        paidAt: payment.paidAt || new Date(),
      });
    }

    return payment;
  }

  const updatedPayment = await updatePayment(
    paymentId,
    {
      status: "PAID",
      transactionId,
      providerPaymentId,
      paidAt: new Date(),
    }
  );

  const booking = await prisma.booking.findUnique({
    where: {
      id: payment.bookingId,
    },

    include: {
      service: true,
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  await prisma.booking.update({
    where: {
      id: payment.bookingId,
    },

    data: {
      status: "CONFIRMED",
    },
  });

  const email = paymentSuccessfulTemplate({
    customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,

    bookingNumber: booking.bookingNumber,

    paymentId: updatedPayment.id,

    amount: updatedPayment.amount,

    currency: updatedPayment.currency,
  });

  await sendNotificationEmail({
    to: booking.customer.email,

    subject: email.subject,

    text: email.text,

    html: email.html,
  });

  return updatedPayment;
}

export async function markPaymentAsFailedService(
  paymentId,
  failureReason
) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "PAID") {
    throw new Error(
      "A paid payment cannot be marked as failed"
    );
  }

  const updatedPayment = await updatePayment(
    paymentId,
    {
      status: "FAILED",
      failureReason,
    }
  );

  const booking = await prisma.booking.findUnique({
    where: {
      id: payment.bookingId,
    },

    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const email = paymentFailedTemplate({
    customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,

    bookingNumber: booking.bookingNumber,

    amount: updatedPayment.amount,

    currency: updatedPayment.currency,

    reason: failureReason,
  });

  await sendNotificationEmail({
    to: booking.customer.email,

    subject: email.subject,

    text: email.text,

    html: email.html,
  });

  return updatedPayment;
}

export async function deletePaymentService(paymentId) {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (
    payment.status === "PAID" ||
    payment.status === "REFUNDED"
  ) {
    throw new Error(
      "Paid or refunded payments cannot be deleted"
    );
  }

  return deletePayment(paymentId);
}