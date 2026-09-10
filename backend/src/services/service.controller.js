import { createServiceService, getServicebyIdService, getOwnServiceService, getVendorServicesService, getServicesService, updateOwnServiceService, deleteOwnServiceService, } from "../services/service.service.js";


export async function createService(req, res) {
  try {
    const service = await createServiceService(
      req.user.id,
      req.body.categoryId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
export async function getServiceById(req, res) {
    try {
        const service = await getServicebyIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Service retrieved successfully",
            data: service,
        });
    } catch (error) {
        console.error("Get service error:", error);

        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}



export async function getOwnService(req, res) {
    try {
        const vendorId = req.user.vendorId;

        const service = await getOwnServiceService(
            vendorId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Service retrieved successfully",
            data: service,
        });
    } catch (error) {
        console.error("Get own service error:", error);

        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}



export async function getVendorServices(req, res) {
    try {
        const vendorId = req.user.vendorId;

        const result =
            await getVendorServicesService({
                vendorId,
                page: req.query.page,
                limit: req.query.limit,
                status: req.query.status,
            });

        return res.status(200).json({
            success: true,
            message: "Vendor services retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error(
            "Get vendor services error:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}



export async function getServices(req, res) {
    try {
        const result = await getServicesService({
            page: req.query.page,
            limit: req.query.limit,
            categoryId: req.query.categoryId,
            vendorId: req.query.vendorId,
            status: req.query.status,
            country: req.query.country,
            city: req.query.city,
            search: req.query.search,
        });

        return res.status(200).json({
            success: true,
            message: "Services retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Get services error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}



export async function updateOwnService(req, res) {
    try {
        const vendorId = req.user.vendorId;

        const service =
            await updateOwnServiceService(
                vendorId,
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service,
        });
    } catch (error) {
        console.error(
            "Update service error:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}


export async function deleteOwnService(req, res) {
    try {
        const vendorId = req.user.vendorId;

        await deleteOwnServiceService(
            vendorId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete service error:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}