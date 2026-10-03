import stripe from "../config/stripe.js";
import prisma from "../config/prisma.js";

export const createStripeCheckoutSessionService = async (
  paymentId,
  customerId
) => {

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: {
        include: {
          service: true,
        },
      },
      customer: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.customerId !== customerId) {
    throw new Error("You are not authorized to pay for this payment");
  }

  if (payment.status !== "PENDING") {
    throw new Error(
      `Payment cannot be processed because its status is ${payment.status}`
    );
  }

  if (payment.booking.status !== "PENDING") {
    throw new Error(
      `Booking cannot be paid because its status is ${payment.booking.status}`
    );
  }

  const amount = Number(payment.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const unitAmount = Math.round(amount * 100);

 const session = await stripe.checkout.sessions.create({
  mode: "payment",

  payment_method_types: ["card"],

  line_items: [
    {
      price_data: {
        currency: payment.currency.toLowerCase(),

        product_data: {
          name: payment.booking.service.name,
          description: `Booking #${payment.booking.bookingNumber}`,
        },

        unit_amount: unitAmount,
      },

      quantity: 1,
    },
  ],

  customer_email: payment.customer.email,

  metadata: {
    paymentId: payment.id,
    bookingId: payment.bookingId,
    customerId: payment.customerId,
  },

  payment_intent_data: {
    metadata: {
      paymentId: payment.id,
      bookingId: payment.bookingId,
      customerId: payment.customerId,
    },
  },

    success_url:
      `${process.env.CLIENT_URL}/payment/success` +
      `?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url:
      `${process.env.CLIENT_URL}/payment/cancel` +
      `?payment_id=${payment.id}`,
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
}

export async function createStripeRefund({
  paymentIntentId,
  amount,
}) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: Math.round(Number(amount) * 100),
  });
}