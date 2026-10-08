import express from "express";
import { createCouponController, getCouponByIdController, getCouponByCodeController, getAllCouponsController, updateCouponController, deleteCouponController, applyCouponController, recordCouponUsageController, } from "../coupon/coupon.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("ADMIN"), createCouponController);

router.get("/", authenticate, authorizeRoles("ADMIN", "SUPPORT"), getAllCouponsController);

router.get("/:id", authenticate, authorizeRoles("ADMIN", "SUPPORT"), getCouponByIdController);

router.get("/code/:code", authenticate, authorizeRoles("ADMIN", "SUPPORT"), getCouponByCodeController);

router.patch("/:id", authenticate, authorizeRoles("ADMIN"), updateCouponController);

router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteCouponController);

router.post("/apply", authenticate, authorizeRoles("CUSTOMER"), applyCouponController);


export default router;