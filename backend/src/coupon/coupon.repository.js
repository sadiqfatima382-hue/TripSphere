import prisma from "../config/prisma.js";

export async function createCoupon(data) {
    return prisma.coupon.create({
        data,
    });
}

export async function findCouponById(id) {
    return prisma.coupon.findUnique({
        where: {
            id,
        },
    });
}

export async function findCouponByCode(code) {
    return prisma.coupon.findUnique({
        where: {
            code,
        },
    });
}

export async function findAllCoupons({
    skip,
    take,
    isActive,
}) {
    const where = {
        ...(isActive !== undefined && {
            isActive,
        }),
    };

    const [coupons, total] = await Promise.all([
        prisma.coupon.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.coupon.count({
            where,
        }),
    ]);

    return {
        coupons,
        total,
    };
}

export async function updateCoupon(id, data) {
    return prisma.coupon.update({
        where: {
            id,
        },
        data,
    });
}

export async function deleteCoupon(id) {
    return prisma.coupon.delete({
        where: {
            id,
        },
    });
}

export async function createCouponUsage(data) {
    return prisma.couponUsage.create({
        data,
        include: {
            coupon: true,
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            booking: {
                select: {
                    id: true,
                    bookingNumber: true,
                    totalPrice: true,
                    currency: true,
                },
            },
        },
    });
}

export async function findCouponUsageById(id) {
    return prisma.couponUsage.findUnique({
        where: {
            id,
        },
        include: {
            coupon: true,
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            booking: {
                select: {
                    id: true,
                    bookingNumber: true,
                    totalPrice: true,
                    currency: true,
                },
            },
        },
    });
}

export async function findCouponUsageByCustomer(
    couponId,
    customerId
) {
    return prisma.couponUsage.findMany({
        where: {
            couponId,
            customerId,
        },
        orderBy: {
            usedAt: "desc",
        },
    });
}

export async function findCouponUsageByBooking(
    couponId,
    bookingId
) {
    return prisma.couponUsage.findUnique({
        where: {
            couponId_bookingId: {
                couponId,
                bookingId,
            },
        },
    });
}

export async function countCouponUsages(couponId) {
    return prisma.couponUsage.count({
        where: {
            couponId,
        },
    });
}

export async function countCustomerCouponUsages(
    couponId,
    customerId
) {
    return prisma.couponUsage.count({
        where: {
            couponId,
            customerId,
        },
    });
}