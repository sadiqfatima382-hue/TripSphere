import { createVendorSchema } from "../validators/vendor/vendor.validations.js";
import {  createVendorService,} from "./vendor.service.js";

export async function createVendor(req, res) {
  try {
    const validatedData =
      createVendorSchema.parse(req.body);

    const vendor = await createVendorService(
      req.user.id,
      validatedData
    );

    res.status(201).json({
      success: true,
      message: "Vendor profile created successfully",
      data: {
        vendor,
      },
    });
  } catch (error) {
    console.error("Create vendor error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}