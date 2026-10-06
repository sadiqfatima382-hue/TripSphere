import { createPayoutService, getPayoutByIdService, getVendorPayoutsService, getAllPayoutsService, processPayoutService, markPayoutAsPaidService, markPayoutAsFailedService, } from "../payout/payout.service.js";

export async function createPayoutController(req, res, next) {
    try {
        const { bookingId, method } = req.body;

        const payout = await createPayoutService(
            bookingId,
            req.user.vendorId,
            method
        );

        return res.status(201).json({
            success: true,
            message: "Payout created successfully",
            data: payout,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getPayoutByIdController(req, res, next) {
    try {
        const payout = await getPayoutByIdService(
            req.params.id,
            req.user.vendorId
        );

        return res.status(200).json({
            success: true,
            data: payout,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getMyPayoutsController(req, res, next) {
    try {
        const result = await getVendorPayoutsService(
            req.user.vendorId,
            req.query
        );

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

export async function getAllPayoutsController(req, res, next) {
    try {
        const result = await getAllPayoutsService(
            req.query
        );

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

export async function processPayoutController(req, res, next) {
    try {
        const payout = await processPayoutService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Payout processing started",
            data: payout,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function markPayoutAsPaidController(req, res, next) {
    try {
        const { transactionId } = req.body;

        const payout = await markPayoutAsPaidService(
            req.params.id,
            transactionId
        );

        return res.status(200).json({
            success: true,
            message: "Payout marked as paid",
            data: payout,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function markPayoutAsFailedController(req, res, next) {
    try {
        const { failureReason } = req.body;

        const payout =
            await markPayoutAsFailedService(
                req.params.id,
                failureReason
            );

        return res.status(200).json({
            success: true,
            message: "Payout marked as failed",
            data: payout,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}