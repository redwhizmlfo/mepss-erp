import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { authenticate, requirePermission } from "../../shared/auth-middleware.js";
import { UserRepository } from "./users.repository.js";
import { UserService } from "./users.service.js";
import { UserController } from "./users.controller.js";

export const usersRouter = Router();

// Inyección de dependencias (Manual)
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

usersRouter.use(authenticate);

usersRouter.get(
  "/roles",
  requirePermission("roles"),
  asyncHandler(userController.listRoles.bind(userController))
);

usersRouter.get(
  "/",
  requirePermission("usuarios"),
  asyncHandler(userController.listUsers.bind(userController))
);

usersRouter.post(
  "/",
  requirePermission("usuarios", "canCreate"),
  asyncHandler(userController.createUser.bind(userController))
);

usersRouter.get(
  "/:id",
  requirePermission("usuarios"),
  asyncHandler(userController.getUserById.bind(userController))
);

usersRouter.put(
  "/:id",
  requirePermission("usuarios", "canEdit"),
  asyncHandler(userController.updateUser.bind(userController))
);

usersRouter.patch(
  "/:id/status",
  requirePermission("usuarios", "canEdit"),
  asyncHandler(userController.updateUserStatus.bind(userController))
);

usersRouter.put(
  "/:id/permissions",
  requirePermission("permisos", "canEdit"),
  asyncHandler(userController.replaceUserPermissions.bind(userController))
);
