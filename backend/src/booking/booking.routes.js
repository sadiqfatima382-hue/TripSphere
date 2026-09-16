import express from "express";
import { createBooking, getBookingById, getBookingByNumber, getCustomerBookings, getVendorBookings, getAllBookings, confirmBooking, cancelBooking, completeBooking, deleteBooking, } from "../booking/booking.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePermission, } from "../middlewares/permission.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createBookingSchema, bookingQuerySchema, cancelBookingSchema, } from "../validators/booking/booking.validation.js";

const router = express.Router();

router.post("/", authenticate, authorizePermission("bookings.create"), validate(createBookingSchema), createBooking);

router.get("/my-bookings", authenticate, authorizePermission("bookings.read"), validate(bookingQuerySchema, "query"), getCustomerBookings);

router.patch("/:id/cancel", authenticate, authorizePermission("bookings.cancel"), validate(cancelBookingSchema), cancelBooking);

router.get("/", authenticate, authorizeRoles("ADMIN", "SUPPORT"), authorizePermission("bookings.read"), validate(bookingQuerySchema, "query"), getAllBookings);

router.patch("/:id/confirm", authenticate, authorizePermission("bookings.update"), confirmBooking);

router.patch("/:id/complete", authenticate, authorizePermission("bookings.update"), completeBooking);

// router.get("/", authenticate, authorizePermission("bookings.read"), validate(bookingQuerySchema, "query"), getAllBookings);

router.get("/number/:bookingNumber", authenticate, authorizePermission("bookings.read"), getBookingByNumber);

router.get("/vendor", authenticate, authorizePermission("bookings.read"), validate(bookingQuerySchema, "query"), getVendorBookings);

router.get("/:id", authenticate, authorizePermission("bookings.read"), getBookingById);

router.delete("/:id", authenticate, authorizePermission("bookings.delete"), deleteBooking);

export default router;