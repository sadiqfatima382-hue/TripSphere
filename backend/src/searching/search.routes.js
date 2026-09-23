import express from "express";

import { searchServices } from "../search/search.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import { serviceSearchSchema } from "../search/search.validation.js";

const router = express.Router();

router.get(  "/services",  validate(serviceSearchSchema, "query"),  searchServices);

export default router;

