import { checkAvailabilityService } from "./availability.service.js";

export async function checkAvailability(req, res, next) {
    try {
        const { serviceId } = req.params
        const { startDate, endDate } = req.validatedQuery;

        const result = await checkAvailabilityService({
            serviceId,
            startDate,
            endDate,
        });

        return res.status(200).json({
            success: true,
            message: "Availability checked successfully",
            data: result,
        });

    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message,
    });
    }
}