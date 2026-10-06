import prisma from "../config/prisma.js";
import { createPayout, findPayoutById, findPayoutByBookingId, findPayoutsByVendor, findAllPayouts, updatePayout, } from "../payout/payout.repository.js";

const PLATFORM_COMMISSION_RATE = 0.10;

export async function createPayoutService(bookingId, vendorId, method) {

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            payment: true,
            service: {
                include: {
                    vendor: true,
                },
            },
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.vendorId !== vendorId) {
        throw new Error(
            "You are not authorized to create a payout for this booking"
        );
    }

    if (booking.status !== "CONFIRMED") {
        throw new Error(
            "Payout can only be created for a completed booking"
        );
    }

    if (!booking.payment) {
        throw new Error(
            "Payout cannot be created because the booking has no payment"
        );
    }

    if (booking.payment.status !== "PAID") {
        throw new Error(
            "Payout can only be created for a paid booking"
        );
    }

    const existingPayout = await findPayoutByBookingId(
        bookingId
    );

    if (existingPayout) {
        throw new Error(
            "Payout already exists for this booking"
        );
    }

    const grossAmount = Number(booking.totalPrice);

    if (!Number.isFinite(grossAmount) || grossAmount <= 0) {
        throw new Error("Invalid booking amount");
    }

    const commissionAmount =
        grossAmount * PLATFORM_COMMISSION_RATE;

    const netAmount =
        grossAmount - commissionAmount;

    return createPayout({
        vendorId,
        bookingId,

        grossAmount,
        commissionAmount,
        netAmount,

        currency: booking.currency,

        method,
        status: "PENDING",
    });
}

export async function getPayoutByIdService(
    payoutId,
    vendorId
) {
    const payout = await findPayoutById(payoutId);

    if (!payout) {
        throw new Error("Payout not found");
    }

    if (
        vendorId &&
        payout.vendor.id !== vendorId
    ) {
        throw new Error(
            "You are not authorized to view this payout"
        );
    }

    return payout;
}

export async function getVendorPayoutsService(
    vendorId,
    query = {}
) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const { status } = query;

    const skip = (page - 1) * limit;

    const { payouts, total } =
        await findPayoutsByVendor(
            vendorId,
            {
                skip,
                take: limit,
                status,
            }
        );

    return {
        payouts,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };
}

export async function getAllPayoutsService(
    query = {}
) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const { status } = query;

    const skip = (page - 1) * limit;

    const { payouts, total } =
        await findAllPayouts({
            skip,
            take: limit,
            status,
        });

    return {
        payouts,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };
}

export async function processPayoutService(
    payoutId
) {
    const payout = await findPayoutById(
        payoutId
    );

    if (!payout) {
        throw new Error("Payout not found");
    }

    if (payout.status !== "PENDING") {
        throw new Error(
            `Payout cannot be processed because its status is ${payout.status}`
        );
    }

    return updatePayout(
        payoutId,
        {
            status: "PROCESSING",
        }
    );
}

export async function markPayoutAsPaidService(
    payoutId,
    transactionId
) {
    const payout = await findPayoutById(
        payoutId
    );

    if (!payout) {
        throw new Error("Payout not found");
    }

    if (payout.status !== "PROCESSING") {
        throw new Error(
            `Payout cannot be marked as paid because its status is ${payout.status}`
        );
    }

    return updatePayout(
        payoutId,
        {
            status: "PAID",
            transactionId,
            processedAt: new Date(),
        }
    );
}

export async function markPayoutAsFailedService(
    payoutId,
    failureReason
) {
    const payout = await findPayoutById(
        payoutId
    );

    if (!payout) {
        throw new Error("Payout not found");
    }

    if (payout.status !== "PROCESSING") {
        throw new Error(
            `Payout cannot be marked as failed because its status is ${payout.status}`
        );
    }

    return updatePayout(
        payoutId,
        {
            status: "FAILED",
            failureReason,
        }
    );
}