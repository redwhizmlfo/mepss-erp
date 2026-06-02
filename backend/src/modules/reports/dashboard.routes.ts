import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { getExecutiveDashboard } from "./dashboard.service.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const dashboard = await getExecutiveDashboard();
    res.json(dashboard);
  })
);

dashboardRouter.get(
  "/executive",
  asyncHandler(async (_req, res) => {
    const dashboard = await getExecutiveDashboard();
    res.json(dashboard);
  })
);
