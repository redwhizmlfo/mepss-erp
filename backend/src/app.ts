import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { dashboardRouter } from "./modules/reports/dashboard.routes.js";
import { HttpError } from "./shared/http-error.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "luxury-ops-backend",
    stack: "node-express-prisma",
    time: new Date().toISOString()
  });
});

app.use("/api/v1/reports/dashboard", dashboardRouter);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Ruta no encontrada"));
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || "Error interno",
    details: error instanceof HttpError ? error.details : undefined
  });
});
