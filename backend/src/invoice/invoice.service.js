import prisma from "../config/prisma.js";
import { createInvoice, findInvoiceById, findInvoiceByBookingId, findInvoiceByPaymentId, findInvoicesByCustomer, findAllInvoices, updateInvoice, } from "../invoice/invoice.repository.js";

function generateInvoiceNumber() {
    const year = new Date().getFullYear();

    const randomNumber = Math.floor(
        100000 + Math.random() * 900000
    );

    return `INV-${year}-${randomNumber}`;
}

export async function createInvoiceService(
    customerId,
    bookingId
) {

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            payment: true,
            service: true,
            customer: true,
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.customerId !== customerId) {
        throw new Error(
            "You are not authorized to create an invoice for this booking"
        );
    }

    if (booking.status !== "CONFIRMED") {
        throw new Error(
            "Invoice can only be created for a completed booking"
        );
    }

    if (!booking.payment) {
        throw new Error(
            "Payment not found for this booking"
        );
    }

    if (booking.payment.status !== "PAID") {
        throw new Error(
            "Invoice can only be created for a paid booking"
        );
    }

    const existingInvoice =
        await findInvoiceByBookingId(bookingId);

    if (existingInvoice) {
        throw new Error(
            "Invoice already exists for this booking"
        );
    }

    const invoiceNumber = generateInvoiceNumber();

    const invoice = await createInvoice({
        invoiceNumber,

        bookingId: booking.id,

        paymentId: booking.payment.id,

        customerId: booking.customerId,

        subtotal: booking.totalPrice,

        tax: 0,

        discount: 0,

        total: booking.totalPrice,

        currency: booking.currency,

        status: "PAID",

        issuedAt: new Date(),

        paidAt: booking.payment.paidAt || new Date(),
    });

    return invoice;
}

export async function getInvoiceByIdService(
    invoiceId,
    customerId
) {
    const invoice = await findInvoiceById(invoiceId);

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    if (
        customerId &&
        invoice.customerId !== customerId
    ) {
        throw new Error(
            "You are not authorized to view this invoice"
        );
    }

    return invoice;
}

export async function getInvoiceByBookingIdService(
    bookingId,
    customerId
) {
    const invoice =
        await findInvoiceByBookingId(bookingId);

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    if (
        customerId &&
        invoice.customerId !== customerId
    ) {
        throw new Error(
            "You are not authorized to view this invoice"
        );
    }

    return invoice;
}

export async function getInvoiceByPaymentIdService(
    paymentId,
    customerId
) {
    const invoice =
        await findInvoiceByPaymentId(paymentId);

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    if (
        customerId &&
        invoice.customerId !== customerId
    ) {
        throw new Error(
            "You are not authorized to view this invoice"
        );
    }

    return invoice;
}

export async function getCustomerInvoicesService(
    customerId,
    query = {}
) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const { invoices, total } =
        await findInvoicesByCustomer(
            customerId,
            {
                skip,
                take: limit,
                status: query.status,
            }
        );

    return {
        invoices,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getAllInvoicesService(
    query = {}
) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const { invoices, total } =
        await findAllInvoices({
            skip,
            take: limit,
            status: query.status,
        });

    return {
        invoices,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function updateInvoiceService(
    invoiceId,
    data
) {
    const invoice = await findInvoiceById(invoiceId);

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    if (invoice.status === "CANCELLED") {
        throw new Error(
            "Cancelled invoice cannot be updated"
        );
    }

    return updateInvoice(invoiceId, data);
}