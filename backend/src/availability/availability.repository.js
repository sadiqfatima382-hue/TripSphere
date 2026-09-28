
import prisma from "../config/prisma.js";

export const findOverlappingBookings = async ({
  serviceId,
  startDate,
  endDate,
}) => {
  return prisma.booking.findMany({
    where: {
      serviceId,

      status: {
        in: ["PENDING", "CONFIRMED"],
      },

      startDate: {
        lt: endDate,
      },

      OR: [
        {
          endDate: {
            gt: startDate,
          },
        },

        {
          endDate: null,

          startDate: {
            gt: startDate,
          },
        },
      ],
    },

    select: {
      id: true,
      bookingNumber: true,
      startDate: true,
      endDate: true,
      status: true,
    },
  });
};