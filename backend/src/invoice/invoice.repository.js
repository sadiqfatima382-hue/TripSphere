import prisma from "../config/prisma.js";

export async function createInvoice(data) {
    return prisma.invoice.create({
        data,
        include: {
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },

            booking: {
                include: {
                    service: true,
                },
            },

            payment: true,
        },
    });
}

export async function findInvoiceById(id) {
    return prisma.invoice.findUnique({
        where: {
            id,
        },

        include: {
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },

            booking: {
                include: {
                    service: true,
                    vendor: {
                        select: {
                            id: true,
                            businessName: true,
                        },
                    },
                },
            },

            payment: true,
        },
    });
}

export async function findInvoiceByBookingId(
    bookingId
) {
    return prisma.invoice.findUnique({
        where: {
            bookingId,
        },

        include: {
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },

            booking: {
                include: {
                    service: true,
                },
            },

            payment: true,
        },
    });
}

export async function findInvoiceByPaymentId(
    paymentId
) {
    return prisma.invoice.findUnique({
        where: {
            paymentId,
        },

        include: {
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },

            booking: {
                include: {
                    service: true,
                },
            },

            payment: true,
        },
    });
}

export async function findInvoicesByCustomer(
    customerId,
    { skip, take, status }
) {
    const where = {
        customerId,
        ...(status && { status }),
    };

    const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            skip,
            take,

            include: {
                booking: {
                    include: {
                        service: true,
                    },
                },

                payment: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.invoice.count({
            where,
        }),
    ]);

    return {
        invoices,
        total,
    };
}

export async function findAllInvoices({
    skip,
    take,
    status,
}) {
    const where = {
        ...(status && { status }),
    };

    const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            skip,
            take,

            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },

                booking: {
                    include: {
                        service: true,
                    },
                },

                payment: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.invoice.count({
            where,
        }),
    ]);

    return {
        invoices,
        total,
    };
}

export async function updateInvoice(id, data) {
    return prisma.invoice.update({
        where: {
            id,
        },

        data,

        include: {
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },

            booking: {
                include: {
                    service: true,
                },
            },

            payment: true,
        },
    });
}