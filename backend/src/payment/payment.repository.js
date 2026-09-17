import prisma from "../config/prisma.js"

export async function createPayment(data) {
    return prisma.payment.create({
        data,
        include: {
            booking: {
                include: {
                    service: {
                        include: {
                            category: true
                        }
                    },
                    vendor: true,
                }
            },
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    })
}

export async function findPaymentById(id) {
    return prisma.payment.findUnique({
        where: { id },
        include: {
            booking: {
                include: {
                    service: {
                        include: {
                            category: true
                        }
                    },
                    vendor: true,
                }
            },
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    })
}

export async function findPaymentByBookingId(bookingId) {
    return prisma.payment.findUnique({
        where: { bookingId },
        include: {
            booking: {
                include: {
                    service: {
                        include: {
                            category: true
                        }
                    },
                    vendor: true,
                }
            },
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    })
}

export async function findPaymentByTransactionId(
    transactionId
) {
    return prisma.payment.findUnique({
        where: { transactionId },
        include: {
            booking: true,
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
}

export async function findPaymentByProviderPaymentId(
    providerPaymentId
) {
    return prisma.payment.findFirst({
        where: {
            providerPaymentId,
        },
        include: {
            booking: true,
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
}

export async function findPaymentsByCustomer({
    customerId,
    skip,
    take,
    status,
    method,
    bookingId,
}) {
    const where = {
        customerId,

        ...(status && {
            status,
        }),

        ...(method && {
            method,
        }),

        ...(bookingId && {
            bookingId,
        }),
    };

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                booking: {
                    include: {
                        service: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.payment.count({
            where,
        }),
    ]);

    return {
        payments,
        total,
    };
}

export async function findAllPayments({
    skip,
    take,
    status,
    method,
    bookingId,
    customerId,
}) {
    const where = {
        ...(status && { status, }),
        ...(method && { method, }),
        ...(bookingId && { bookingId, }),
        ...(customerId && { customerId, }),
    };

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                booking: {
                    include: {
                        service: {
                            include: {
                                category: true,
                            },
                        },
                        vendor: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        }),

        prisma.payment.count({
            where,
        }),
    ]);

    return {
        payments,
        total,
    };
}

export async function updatePayment(id, data) {
    return prisma.payment.update({
        where: { id },
        data,
        include: {
            booking: true,
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
}

export async function deletePayment(id) {
    return prisma.payment.delete({
        where: { id },
    });
}