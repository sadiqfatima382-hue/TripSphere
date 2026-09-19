import { createPaymentService, getPaymentByIdService, getCustomerPaymentsService, getAllPaymentsService, deletePaymentService, } from "../payment/payment.service.js";
import { createStripeCheckoutSessionService } from "./stripe.service.js";
// Create Payment
export const createPayment = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        const payment = await createPaymentService(customerId, req.body);

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

// Get Payment By ID
export const getPaymentById = async (req, res, next) => {
    try {
        const payment = await getPaymentByIdService(
            req.params.id,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            data: payment,
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

// Get Customer Payments
export const getCustomerPayments = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        const result = await getCustomerPaymentsService(
            customerId,
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Customer payments fetched successfully",
            data: result.payments,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

// Get All Payments
export const getAllPayments = async (req, res, next) => {
    try {
        const result = await getAllPaymentsService(req.validatedQuery);

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: result.payments,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

// Delete Payment
export const deletePayment = async (req, res, next) => {
    try {
        await deletePaymentService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const createCheckoutSession = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const customerId = req.user.id;

    const session = await createStripeCheckoutSessionService(
      paymentId,
      customerId
    );

    return res.status(200).json({
      success: true,
      message: "Stripe Checkout session created successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};
export const paymentSuccess = async (req, res) => {
  return res.status(200).send(`
    <html>
      <head>
        <title>Payment Successful</title>
      </head>
      <body>
        <h1>Payment Successful ✅</h1>
        <p>Your Stripe payment was completed.</p>
        <p>Session ID: ${req.query.session_id ?? "Not provided"}</p>
      </body>
    </html>
  `);
};

export const paymentCancel = async (req, res) => {
  return res.status(200).send(`
    <html>
      <head>
        <title>Payment Cancelled</title>
      </head>
      <body>
        <h1>Payment Cancelled ❌</h1>
        <p>Your payment was cancelled.</p>
      </body>
    </html>
  `);
};