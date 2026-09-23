import { searchServicesService } from "../services/search.service.js";

export const searchServices = async (req, res, next) => {
  try {
    const result = await searchServicesService(req.validatedQuery);

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
  })
};
}
