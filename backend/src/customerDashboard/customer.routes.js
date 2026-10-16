import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getCustomerDashboardController, } from "./customer.controller.js";

const router = expressRouter();

router.get(
    "/",
    authenticate,
    authorizeRoles("CUSTOMER"),
    getCustomerDashboardController
);

export default router;
