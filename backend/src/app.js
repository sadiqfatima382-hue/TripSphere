import express from "express"
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan"

import env from "./config/env.js";

const app = express();
app.use(helmet());

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }));

  app.use(morgan("dev"));

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TripSphere API is running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to TripSphere API",
  });
});

export default app;