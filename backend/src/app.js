import express from "express"
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan"
import env from "./config/env.js";
import authRoutes from "./auth/auth.routes.js";
const app = express();
app.use(helmet());

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TripSphere API",
  });
});

export default app;