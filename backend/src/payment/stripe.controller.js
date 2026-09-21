import stripe from "../config/stripe.js";

import {  markPaymentAsPaidService,  markPaymentAsFailedService,} from "./payment.service.js";

export const stripeWebhook = async (req, res, next) => {
  console.log("🔥 Stripe webhook received");

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Stripe signature verified");
    console.log("📦 Event type:", event.type);
  } catch (error) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature",
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("💳 Checkout session completed");
        console.log("Session ID:", session.id);
        console.log("Payment ID:", session.metadata?.paymentId);
        console.log("Payment Intent:", session.payment_intent);

        const paymentId = session.metadata?.paymentId;

        if (!paymentId) {
          console.error("❌ Payment ID missing from metadata");

          return res.status(400).json({
            success: false,
            message: "Payment ID missing from Stripe metadata",
          });
        }

        const paymentIntentId = session.payment_intent;

        await markPaymentAsPaidService(
          paymentId,
          paymentIntentId,
          paymentIntentId
        );

        console.log(
          `✅ Payment ${paymentId} marked as PAID`
        );

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        console.log("❌ PaymentIntent failed");

        const paymentId = paymentIntent.metadata?.paymentId;

        if (!paymentId) {
          console.log(
            "Payment ID missing from failed PaymentIntent metadata"
          );

          break;
        }

        const failureReason =
          paymentIntent.last_payment_error?.message ||
          "Payment failed";

        await markPaymentAsFailedService(
          paymentId,
          failureReason
        );

        console.log(
          `Payment ${paymentId} marked as FAILED`
        );

        break;
      }

      default:
        console.log(
          `ℹ️ Unhandled Stripe event: ${event.type}`
        );
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(
      "❌ Stripe webhook processing error:",
      error
    );

    next(error);
  }
};