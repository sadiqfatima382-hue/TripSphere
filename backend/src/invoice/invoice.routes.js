import express from "express";
import { createInvoiceController, getInvoiceByIdController, getInvoiceByBookingIdController, getInvoiceByPaymentIdController, getMyInvoicesController, getAllInvoicesController, } from "../invoice/invoice.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createInvoiceSchema } from "../invoice/invoice.validation.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorizeRoles("CUSTOMER"), validate(createInvoiceSchema), createInvoiceController);

router.get("/my-invoices", authorizeRoles("CUSTOMER"), getMyInvoicesController);

router.get("/booking/:bookingId", authorizeRoles("CUSTOMER"), getInvoiceByBookingIdController);

router.get("/payment/:paymentId", authorizeRoles("CUSTOMER"), getInvoiceByPaymentIdController);

router.get("/:id", authorizeRoles("CUSTOMER"), getInvoiceByIdController);

router.get("/", authorizeRoles("ADMIN", "SUPPORT"), getAllInvoicesController);

export default router;