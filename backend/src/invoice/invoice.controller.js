import { createInvoiceService, getInvoiceByIdService, getInvoiceByBookingIdService, getInvoiceByPaymentIdService, getCustomerInvoicesService, getAllInvoicesService, } from "../invoice/invoice.service.js";

export async function createInvoiceController(req, res, next) {
    try {
        const { bookingId } = req.body;
        const invoice = await createInvoiceService(
            req.user.id,
            bookingId
        );

        return res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getInvoiceByIdController(req, res, next) {
    try {
        const invoice = await getInvoiceByIdService(
            req.params.id,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getInvoiceByBookingIdController(req, res, next) {
    try {
        const invoice =
            await getInvoiceByBookingIdService(
                req.params.bookingId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getInvoiceByPaymentIdController(req, res, next) {
    try {
        const invoice =
            await getInvoiceByPaymentIdService(
                req.params.paymentId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getMyInvoicesController(req, res, next) {
    try {
        const result =
            await getCustomerInvoicesService(
                req.user.id,
                req.query
            );

        return res.status(200).json({
            success: true,
            data: result.invoices,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export async function getAllInvoicesController(req, res, next) {
    try {
        const result =
            await getAllInvoicesService(req.query);

        return res.status(200).json({
            success: true,
            data: result.invoices,
            pagination: result.pagination,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}