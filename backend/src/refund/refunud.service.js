import prisma from "../config/prisma.js";
import {  createRefund, findRefundById,  findRefundsByPayment,  findAllRefunds,  updateRefund,} from "../refund/refund.repository.js";
import { createStripeRefund } from "../payment/stripe.service.js";

export async function createRefundService(customerId, data) {
  const { paymentId, amount, reason } = data;

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.customerId !== customerId) {
    throw new Error(
      "You are not authorized to request a refund for this payment"
    );
  }

  if (payment.status !== "PAID") {
    throw new Error(
      "Only paid payments can be refunded"
    );
  }

  if (payment.method !== "STRIPE") {
    throw new Error(
      "Only Stripe payments can be refunded automatically"
    );
  }

  if (!payment.booking) {
    throw new Error("Booking not found");
  }

  if (payment.booking.status !== "CANCELLED") {
    throw new Error(
      "Booking must be cancelled before requesting a refund"
    );
  }

  const previousRefunds = await findRefundsByPayment(paymentId);

  const refundedAmount = previousRefunds
    .filter((refund) => refund.status === "SUCCEEDED")
    .reduce((total, refund) => total + Number(refund.amount), 0);

  const paymentAmount = Number(payment.amount);
  const remainingAmount = paymentAmount - refundedAmount;

  if (amount > remainingAmount) {
    throw new Error(
      `Refund amount cannot exceed the remaining refundable amount of ${remainingAmount}`
    );
  }

  const activeRefund = previousRefunds.find(
    (refund) =>
      refund.status === "PENDING" ||
      refund.status === "PROCESSING"
  );

  if (activeRefund) {
    throw new Error(
      "A refund is already being processed for this payment"
    );
  }

  return createRefund({
    paymentId,
    amount,
    currency: payment.currency,
    reason,
    status: "PENDING",
  });
}

export async function getRefundByIdService(refundId) {
  const refund = await findRefundById(refundId);

  if (!refund) {
    throw new Error("Refund not found");
  }

  return refund;
}

export async function getPaymentRefundsService(paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return {
    customerId: payment.customerId,
    refunds: await findRefundsByPayment(paymentId),
  };
}

export async function getAllRefundsService(query = {}) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { status } = query;

  const skip = (page - 1) * limit;

  const { refunds, total } = await findAllRefunds({
    skip,
    take: limit,
    status,
  });

  return {
    refunds,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateRefundService(refundId, data) {
  const refund = await findRefundById(refundId);

  if (!refund) {
    throw new Error("Refund not found");
  }

  return updateRefund(refundId, data);
}

export async function processStripeRefundService(
  refundId,
  customerId
) {
  const refund = await findRefundById(refundId);

  if (!refund) {
    throw new Error("Refund not found");
  }

  if (refund.payment.customerId !== customerId) {
    throw new Error(
      "You are not authorized to process this refund"
    );
  }

  if (refund.status !== "PENDING") {
    throw new Error(
      "Only pending refunds can be processed"
    );
  }

  const payment = refund.payment;

  if (payment.status !== "PAID") {
    throw new Error(
      "Only paid payments can be refunded"
    );
  }

  if (payment.method !== "STRIPE") {
    throw new Error(
      "Only Stripe payments can be refunded"
    );
  }

  if (!payment.providerPaymentId) {
    throw new Error(
      "Stripe payment ID is missing"
    );
  }

  await updateRefund(refundId, {
    status: "PROCESSING",
  });

  try {
    const stripeRefund = await createStripeRefund({
      paymentIntentId: payment.providerPaymentId,
      amount: refund.amount,
    });

    const updatedRefund = await updateRefund(refundId, {
      status:
        stripeRefund.status === "succeeded"
          ? "SUCCEEDED"
          : "PROCESSING",

      providerRefundId: stripeRefund.id,

      processedAt:
        stripeRefund.status === "succeeded"
          ? new Date()
          : null,
    });

    if (stripeRefund.status === "succeeded") {
      const paymentRefunds = await findRefundsByPayment(
        payment.id
      );

      const successfulRefundAmount = paymentRefunds
        .filter((item) => item.status === "SUCCEEDED")
        .reduce(
          (total, item) => total + Number(item.amount),
          0
        );

      if (
        successfulRefundAmount >= Number(payment.amount)
      ) {
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: "REFUNDED",
          },
        });
      }
    }

    return updatedRefund;
  } catch (error) {
    await updateRefund(refundId, {
      status: "FAILED",
    });

    throw new Error(
      `Stripe refund failed: ${error.message}`
    );
  }
}