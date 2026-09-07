import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePermission } from "../middlewares/permission.middleware.js";
import {  createVendor,} from "./vendor.controller.js";

const router = express.Router();

router.post("/",authenticate,authorizePermission("vendors.create"),  createVendor);

export default router;