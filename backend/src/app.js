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
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TripSphere API",
  });
});

export default app;