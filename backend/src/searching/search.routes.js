import express from "express";

import { searchServices } from "../searching/search.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import { serviceSearchSchema } from "../searching/search.validation.js";

const router = express.Router();

router.get(  "/services",  validate(serviceSearchSchema, "query"),  searchServices);

export default router;

