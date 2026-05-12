import { Router } from "express";
import { authenticate } from "../../shared/auth-middleware.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { loginSchema } from "./auth.schemas.js";
import { getCurrentUser, login } from "./auth.service.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const result = await login(payload);
    res.json(result);
  })
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await getCurrentUser(req.user!.id);
    res.json(user);
  })
);
