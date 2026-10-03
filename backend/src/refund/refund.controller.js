import { createRefundService, getRefundByIdService, getPaymentRefundsService, getAllRefundsService, processStripeRefundService} from "./refunud.service.js";

export async function createRefundController(req, res, next) {
    try {
        const refund = await createRefundService(req.user.id, req.body)
        return req.status(201).json({
            success: true,
            message:("Refund Request Created Successfully"),
            data: refund,
        })
    } catch (error) {
         return req.status(500).json({
            success: false,
            message: error.message,
    })
}
}

export async function getRefundByIdController(req, res, next) {
  try {
    const refund = await getRefundByIdService(req.params.id);

    if (
      req.user.role === "CUSTOMER" &&
      refund.payment.customerId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this refund",
      });
    }

    if (req.user.role === "VENDOR") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this refund",
      });
    }

    return res.status(200).json({
      success: true,
      data: refund,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
  })
  }
}

export async function getPaymentRefundsController(req, res, next) {
  try {
    const result = await getPaymentRefundsService(req.params.paymentId);

    if (
      req.user.role === "CUSTOMER" &&
      result.customerId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these refunds",
      });
    }

    if (req.user.role === "VENDOR") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these refunds",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.refunds,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
  })
  }
}

export async function getAllRefundsController(req, res, next) {
  try {
    const result = await getAllRefundsService(req.validatedQuery);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
  })
}
}

export async function processStripeRefundController(req, res, next) {
  try {
    const refund = await processStripeRefundService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: refund,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
  })
  }
}