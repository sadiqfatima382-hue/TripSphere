
import express from "express";
import { checkAvailability,} from "./availability.controller.js";
import {  validate,} from "../middlewares/validate.middleware.js";
import {  checkAvailabilitySchema,} from "./availability.validation.js";

const router = express.Router();

router.get(  "/services/:serviceId",  validate(checkAvailabilitySchema, "query"),  checkAvailability);

export default router;