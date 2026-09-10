import express from "express";
import { createService, getServiceById, getOwnService, getVendorServices, getServices, updateOwnService, deleteOwnService, } from "./service.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePermission } from "../middlewares/permission.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createServiceSchema, updateServiceSchema, serviceQuerySchema, } from "../validators/services/service.validation.js";

const router = express.Router();

router.post("/", authenticate, authorizePermission("services.create"), validate(createServiceSchema), createService);
router.get("/my-services", authenticate, authorizePermission("services.read"), validate(serviceQuerySchema, "query"), getVendorServices);
router.get("/", authenticate, authorizePermission("services.read"), validate(serviceQuerySchema, "query"), getServices);
router.get("/my-services/:id", authenticate, authorizePermission("services.read"), getOwnService);
router.get("/:id", authenticate, authorizePermission("services.read"), getServiceById);
router.patch("/:id", authenticate, authorizePermission("services.update"), validate(updateServiceSchema), updateOwnService);
router.delete("/:id", authenticate, authorizePermission("services.delete"), deleteOwnService);

export default router;