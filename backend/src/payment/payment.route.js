import express from "express";
import { createPayment, getPaymentById, getCustomerPayments, getAllPayments, deletePayment, } from "../payment/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePermission } from "../middlewares/permission.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createPaymentSchema, paymentQuerySchema, } from "../validators/payment/payment.validation.js";

const router = express.Router();

router.post("/", authenticate, authorizePermission("payments.read"), validate(createPaymentSchema), createPayment);
router.get("/my-payments", authenticate, authorizePermission("payments.read"), validate(paymentQuerySchema, "query"), getCustomerPayments);
router.get("/:id", authenticate, authorizePermission("payments.create"), getPaymentById);
router.get("/", authenticate, authorizePermission("payments.read"), validate(paymentQuerySchema, "query"), getAllPayments);
router.delete("/:id", authenticate, authorizePermission("payments.read"), deletePayment);

export default router;