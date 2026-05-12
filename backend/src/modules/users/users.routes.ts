import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { authenticate, requirePermission } from "../../shared/auth-middleware.js";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserPermissionsSchema,
  updateUserSchema,
  updateUserStatusSchema
} from "./users.schemas.js";
import {
  createUser,
  getUserById,
  listRoles,
  listUsers,
  replaceUserPermissions,
  updateUser,
  updateUserStatus
} from "./users.service.js";

export const usersRouter = Router();

usersRouter.use(authenticate);

function routeId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

usersRouter.get(
  "/roles",
  requirePermission("roles"),
  asyncHandler(async (_req, res) => {
    res.json(await listRoles());
  })
);

usersRouter.get(
  "/",
  requirePermission("usuarios"),
  asyncHandler(async (req, res) => {
    const query = listUsersQuerySchema.parse(req.query);
    res.json(await listUsers(query));
  })
);

usersRouter.post(
  "/",
  requirePermission("usuarios", "canCreate"),
  asyncHandler(async (req, res) => {
    const payload = createUserSchema.parse(req.body);
    const user = await createUser(payload);
    res.status(201).json(user);
  })
);

usersRouter.get(
  "/:id",
  requirePermission("usuarios"),
  asyncHandler(async (req, res) => {
    res.json(await getUserById(routeId(req.params.id)));
  })
);

usersRouter.put(
  "/:id",
  requirePermission("usuarios", "canEdit"),
  asyncHandler(async (req, res) => {
    const payload = updateUserSchema.parse(req.body);
    res.json(await updateUser(routeId(req.params.id), payload));
  })
);

usersRouter.patch(
  "/:id/status",
  requirePermission("usuarios", "canEdit"),
  asyncHandler(async (req, res) => {
    const payload = updateUserStatusSchema.parse(req.body);
    res.json(await updateUserStatus(routeId(req.params.id), payload.active));
  })
);

usersRouter.put(
  "/:id/permissions",
  requirePermission("permisos", "canEdit"),
  asyncHandler(async (req, res) => {
    const payload = updateUserPermissionsSchema.parse(req.body);
    res.json(await replaceUserPermissions(routeId(req.params.id), payload.permissions));
  })
);
