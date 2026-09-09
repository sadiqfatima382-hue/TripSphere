import { createVendorSchema, updateVendorSchema, vendorQuerySchema } from "../validators/vendor/vendor.validations.js";
import {  createVendorService, getOwnVendorService , getVendorByIdService,updateOwnVendorService,getVendorService,approveVendorService,suspendVendorService,rejectVendorService} from "./vendor.service.js";

export async function createVendor(req, res) {
  try {
    const validatedData =
      createVendorSchema.parse(req.body);

    const vendor = await createVendorService(
      req.user.id,
      validatedData
    );

     return res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error("Create vendor error:", error);

   return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getOwnVendor(req, res) {
  try {
    const vendor = await getOwnVendorService(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: {
        vendor,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getVendorById(req, res) {
  try {
    const vendor = await getVendorByIdService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: {
        vendor,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateOwnVendor(req, res) {
  try {
    const validatedData =
      updateVendorSchema.parse(req.body);

    const vendor = await updateOwnVendorService(
      req.user.id,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error("Update vendor error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getVendors(req, res) {
  try {
    const query = vendorQuerySchema.parse(req.query);

    const result = await getVendorService(query);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get vendors error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function approveVendor(req, res) {
  try {
    const vendor = await approveVendorService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error("Approve vendor error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function rejectVendor(req, res) {
  try {
    const vendor = await rejectVendorService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error("Reject vendor error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function suspendVendor(req, res) {
  try {
    const vendor = await suspendVendorService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Vendor suspended successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error("Suspend vendor error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}