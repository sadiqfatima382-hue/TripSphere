import express from "express"
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan"
import env from "./config/env.js";
import authRoutes from "./auth/auth.routes.js";
import vendorRoutes from "./vendor/vendor.routes.js"
import serviceRoutes from "./services/service.routes.js";
import bookingRoutes from "./booking/booking.routes.js";
import paymentRoutes from "./payment/payment.routes.js";
import stripeRoutes from "./payment/stripe.routes.js";
import reviewRoutes from "./review/review.routes.js";
import searchRoutes from "./searching/search.routes.js";
import availabilityRoutes from "./availability/availability.routes.js";
import refundRoutes from "./refund/refund.routes.js"
import payoutRoutes from "./payout/payout.routes.js";
import invoiceRoutes from "./invoice/invoice.routes.js";
import couponRoutes from "./coupon/coupon.routes.js";
import AdminRoutes from "./adminDashboard/admin.routes.js";
const app = express();
app.use("/api/v1/payments/stripe", stripeRoutes);
app.use(helmet());

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vendors", vendorRoutes)
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/refund", refundRoutes)
app.use("/api/v1/payouts", payoutRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/AdminDashboard", AdminRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TripSphere API",
  });
});

export default app;