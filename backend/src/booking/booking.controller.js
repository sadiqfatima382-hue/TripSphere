import { createBookingService, getBookingByIdService, getBookingByNumberService, getCustomerBookingsService, getVendorBookingsService, getAllBookingsService, confirmBookingService, cancelBookingService, completeBookingService, deleteBookingService, } from "../booking/booking.service.js";

export async function createBooking(req, res, next) {
    try {
        const booking = await createBookingService(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}

export async function getBookingById(req, res, next) {
    try {
        const booking = await getBookingByIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}

export async function getBookingByNumber(req, res, next) {
    try {
        const booking = await getBookingByNumberService(
            req.params.bookingNumber
        );

        return res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}

export async function getCustomerBookings(req, res, next) {
    try {
        const result =
            await getCustomerBookingsService(
                req.user.id,
                req.validatedQuery
            );

        return res.status(200).json({
            success: true,
            message: "Customer bookings retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: result,
        })
    }
}

export async function getVendorBookings(
    req, res, next
) {
    try {
        const result = await getVendorBookingsService(
            req.user.vendorId,
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Vendor bookings retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: result,
        })
    }
}

export async function getAllBookings(req, res, next) {
    try {
        const result = await getAllBookingsService(
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: result,
        })
    }
}

export async function confirmBooking(req, res, next) {
    try {
        const booking = await confirmBookingService(
            req.params.id,
            req.user.vendorId
        );

        return res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}

export async function cancelBooking(req, res, next) {
    try {
        const booking = await cancelBookingService(
            req.params.id,
            req.user.id,
            req.body.reason
        );

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}

export async function completeBooking(req, res, next) {
    try {
        const booking = await completeBookingService(
            req.params.id,
            req.user.vendorId
        );

        return res.status(200).json({
            success: true,
            message: "Booking completed successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}

export async function deleteBooking(req, res, next) {
    try {
        const booking = await deleteBookingService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
            data: booking,
        });
    } catch (error) {
        return res.status(201).json({
            success: false,
            message: message.error,
            data: booking,
        })
    }
}