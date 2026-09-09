import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePermission } from "../middlewares/permission.middleware.js";
import { createVendor, getOwnVendor, getVendorById, updateOwnVendor, getVendors, approveVendor, rejectVendor, suspendVendor, } from "./vendor.controller.js";

const router = express.Router();

//Vendor Own Profile

router.post("/", authenticate, authorizePermission("vendors.create"), createVendor);
router.get("/me", authenticate, authorizePermission("vendors.read"), getOwnVendor);
router.patch("/me", authenticate, authorizePermission("vendors.update"), updateOwnVendor);

//  Admin Vendor Management

router.get("/", authenticate, authorizePermission("vendors.read"), getVendors);
router.get("/:id", authenticate, authorizePermission("vendors.read"), getVendorById);
router.patch("/:id/approve", authenticate, authorizePermission("vendors.approve"), approveVendor);
router.patch("/:id/reject", authenticate, authorizePermission("vendors.approve"), rejectVendor);
router.patch("/:id/suspend", authenticate, authorizePermission("vendors.approve"), suspendVendor
);

export default router;
