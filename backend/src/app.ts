import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { dashboardRouter } from "./modules/reports/dashboard.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { inventoryRouter } from "./modules/inventory/inventory.routes.js";
import { salesRouter } from "./modules/sales/sales.routes.js";
import { customersRouter } from "./modules/customers/customers.routes.js";
import { employeesRouter } from "./modules/employees/employees.routes.js";
import { authenticate, requirePermission } from "./shared/auth-middleware.js";
import { HttpError } from "./shared/http-error.js";

export const app = express();

const allowedOrigins = new Set([
  env.FRONTEND_URL,
  "http://localhost:3000",
  "https://mepss-erp-frontend.vercel.app"
]);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true
}));
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/sales", salesRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/employees", employeesRouter);
app.use("/api/v1/reports/dashboard", authenticate, requirePermission("dashboard"), dashboardRouter);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Ruta no encontrada"));
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Datos invalidos",
      details: error.flatten()
    });
    return;
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || "Error interno",
    details: error instanceof HttpError ? error.details : undefined
  });
});
