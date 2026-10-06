import express from "express";
import { createPayoutController, getPayoutByIdController, getMyPayoutsController, getAllPayoutsController, processPayoutController, markPayoutAsPaidController, markPayoutAsFailedController, } from "../payout/payout.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPayoutSchema, } from "../payout/payout.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorizeRoles("VENDOR"), validate(createPayoutSchema), createPayoutController);

router.get("/my-payouts", authorizeRoles("VENDOR"), getMyPayoutsController);

router.get("/", authorizeRoles("ADMIN", "SUPPORT"), getAllPayoutsController);

router.patch("/:id/process", authorizeRoles("ADMIN", "SUPPORT"), processPayoutController);

router.patch("/:id/paid", authorizeRoles("ADMIN", "SUPPORT"), markPayoutAsPaidController);

router.patch("/:id/failed", authorizeRoles("ADMIN", "SUPPORT"), markPayoutAsFailedController);

router.get("/:id", authorizeRoles("VENDOR"), getPayoutByIdController);

export default router;