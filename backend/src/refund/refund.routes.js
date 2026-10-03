import express from "express";
import {  createRefundController,  getRefundByIdController,  getPaymentRefundsController,  getAllRefundsController,} from "../refund/refund.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createRefundSchema } from "../refund/refund.validation.js";
import { paginationSchema } from "../validators/common.validation.js";

const router = express.Router();

router.use(authenticate);

router.post(  "/",  authorizeRoles("CUSTOMER"),  validate(createRefundSchema),  createRefundController);

router.get(  "/",  authorizeRoles("ADMIN", "SUPPORT"),  validate(paginationSchema, "query"),  getAllRefundsController);

router.get(  "/payments/:paymentId",  getPaymentRefundsController);

router.get(  "/:id",  getRefundByIdController);

export default router;