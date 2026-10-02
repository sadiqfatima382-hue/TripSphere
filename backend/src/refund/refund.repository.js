import prisma from "../config/prisma.js"

export async function createRefund(data) {
    return prisma.refund.create({
        data
    })
}

export async function findRefundById(id) {
    return prisma.refund.findUnique({
        where: { id },
        include: {
            payment: {
                include: {
                    customer: true,
                    booking: true,
                }
            }
        }
    })
}

export async function findRefundsByPayment(paymentId) {
    return prisma.refund.findMany({
        where: { paymentId },

        orderBy: { createdAt: "desc" }
    })

}

export async function findAllRefunds({
  skip,
  take,
  status,
}) {
  const where = {
    ...(status && { status }),
  };

  const [refunds, total] = await Promise.all([
    prisma.refund.findMany({
      where,
      skip,
      take,
      include: {
        payment: {
          include: {
            booking: true,
            customer: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.refund.count({
      where,
    }),
  ]);

  return {
    refunds,
    total,
  };
}

export async function updateRefund(id, data) {
  return prisma.refund.update({
    where: { id },
    data,
  });
}