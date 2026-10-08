import prisma from "../config/prisma.js";
import { createCoupon, findAllCoupons, findCouponByCode, findCouponById, updateCoupon, deleteCoupon, createCouponUsage,  findCouponUsageByBooking, findCouponUsageByCustomer, findCouponUsageById, countCustomerCouponUsages, countCouponUsages } from "../coupon/coupon.repository.js";

export async function createCouponService(data) {
    const code = data.code.toUpperCase();

    const existingCoupon = await findCouponByCode(code);

    if (existingCoupon) {
        throw new Error("Coupon code already exist")
    }

    if (data.DiscountType == "FIXED" && data.DiscountValue <= 0) {
        throw new Error("Fixed discount must be greater than zero")
    }

    if (data.DiscountType == "PERCENTAGE" && data.DiscountValue > 100) {
        throw new Error("Percentage discount cannnot exceed 100%")
    }

    return createCoupon({
        ...data,
        code
    });
}

export async function getCouponByIdService(couponId) {
    const coupon = await findCouponById(couponId)
    if (!coupon) {
        throw new Error("Coupon not found ")
    }

    return ({
        coupon,
    })
}

export async function getCouponByCodeService(code) {
    const coupon = await findCouponByCode(
        code.toUpperCase()
    );

    if (!coupon) {
        throw new Error("Coupon not found");
    }

    return coupon;
}

export async function getAllCouponsService(
    query = {}
) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const isActive =
        query.isActive === undefined
            ? undefined
            : query.isActive === "true";

    const { coupons, total } =
        await findAllCoupons({
            skip,
            take: limit,
            isActive,
        });

    return {
        coupons,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function updateCouponService(
    couponId,
    data
) {
    const coupon = await findCouponById(couponId);

    if (!coupon) {
        throw new Error("Coupon not found");
    }

    if (data.code) {
        const code = data.code.toUpperCase();

        const existingCoupon =
            await findCouponByCode(code);

        if (
            existingCoupon &&
            existingCoupon.id !== couponId
        ) {
            throw new Error(
                "Coupon code already exists"
            );
        }

        data.code = code;
    }

    if (
        data.discountType === "PERCENTAGE" &&
        data.discountValue !== undefined &&
        data.discountValue > 100
    ) {
        throw new Error(
            "Percentage discount cannot exceed 100%"
        );
    }

    return updateCoupon(couponId, data);
}

export async function deleteCouponService(
    couponId
) {
    const coupon = await findCouponById(couponId);

    if (!coupon) {
        throw new Error("Coupon not found");
    }

    return updateCoupon(couponId, {
        isActive: false,
    });
}

export async function applyCouponService(
  customerId,
  bookingId,
  code
) {
  const coupon = await findCouponByCode(
    code.toUpperCase()
  );

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new Error("Coupon is inactive");
  }

  const now = new Date();

  if (now < coupon.startsAt) {
    throw new Error("Coupon is not active yet");
  }

  if (now > coupon.expiresAt) {
    throw new Error("Coupon has expired");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new Error(
      "You are not authorized to apply this coupon"
    );
  }

  if (booking.status !== "PENDING") {
    throw new Error(
      "Coupon can only be applied to a pending booking"
    );
  }

  const bookingAmount = Number(
    booking.subtotal ?? booking.totalPrice
  );

  if (
    coupon.minimumBookingAmount !== null &&
    bookingAmount <
      Number(coupon.minimumBookingAmount)
  ) {
    throw new Error(
      `Minimum booking amount is ${coupon.minimumBookingAmount}`
    );
  }

  if (coupon.usageLimit !== null) {
    const totalUsages =
      await countCouponUsages(coupon.id);

    if (totalUsages >= coupon.usageLimit) {
      throw new Error(
        "Coupon usage limit has been reached"
      );
    }
  }

  if (coupon.usageLimitPerCustomer !== null) {
    const customerUsages =
      await countCustomerCouponUsages(
        coupon.id,
        customerId
      );

    if (
      customerUsages >=
      coupon.usageLimitPerCustomer
    ) {
      throw new Error(
        "You have reached the usage limit for this coupon"
      );
    }
  }

  const existingUsage =
    await findCouponUsageByBooking(
      coupon.id,
      bookingId
    );

  if (existingUsage) {
    throw new Error(
      "Coupon has already been applied to this booking"
    );
  }

  let discountAmount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discountAmount =
      bookingAmount *
      (Number(coupon.discountValue) / 100);

    if (coupon.maximumDiscountAmount !== null) {
      discountAmount = Math.min(
        discountAmount,
        Number(coupon.maximumDiscountAmount)
      );
    }
  } else {
    discountAmount = Number(
      coupon.discountValue
    );
  }

  discountAmount = Math.min(
    discountAmount,
    bookingAmount
  );

  discountAmount = Number(
    discountAmount.toFixed(2)
  );

  const finalAmount = Number(
    (bookingAmount - discountAmount).toFixed(2)
  );

  return prisma.$transaction(async (tx) => {
    const updatedBooking =
      await tx.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          subtotal: bookingAmount,
          discountAmount,
          totalPrice: finalAmount,
        },
      });

    const usage =
      await tx.couponUsage.create({
        data: {
          couponId: coupon.id,
          customerId,
          bookingId,
          discountAmount,
        },
      });

    await tx.coupon.update({
      where: {
        id: coupon.id,
      },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });

    return {
      couponId: coupon.id,
      code: coupon.code,
      bookingId,
      originalAmount: bookingAmount,
      discountAmount,
      finalAmount,
      currency: booking.currency,
      booking: updatedBooking,
      usage,
    };
  });
}

