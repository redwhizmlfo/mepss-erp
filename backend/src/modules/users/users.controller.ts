import { Request, Response } from "express";
import { UserService } from "./users.service.js";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserPermissionsSchema,
  updateUserSchema,
  updateUserStatusSchema
} from "./users.schemas.js";

function routeId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export class UserController {
  constructor(private readonly userService: UserService) {}

  public async listRoles(_req: Request, res: Response) {
    const roles = await this.userService.listRoles();
    res.json(roles);
  }

  public async listUsers(req: Request, res: Response) {
    const query = listUsersQuerySchema.parse(req.query);
    const users = await this.userService.listUsers(query);
    res.json(users);
  }

  public async createUser(req: Request, res: Response) {
    const payload = createUserSchema.parse(req.body);
    const user = await this.userService.createUser(payload);
    res.status(201).json(user);
  }

  public async getUserById(req: Request, res: Response) {
    const user = await this.userService.getUserById(routeId(req.params.id));
    res.json(user);
  }

  public async updateUser(req: Request, res: Response) {
    const payload = updateUserSchema.parse(req.body);
    const user = await this.userService.updateUser(routeId(req.params.id), payload);
    res.json(user);
  }

  public async updateUserStatus(req: Request, res: Response) {
    const payload = updateUserStatusSchema.parse(req.body);
    const user = await this.userService.updateUserStatus(routeId(req.params.id), payload.active);
    res.json(user);
  }

  public async replaceUserPermissions(req: Request, res: Response) {
    const payload = updateUserPermissionsSchema.parse(req.body);
    const user = await this.userService.replaceUserPermissions(routeId(req.params.id), payload.permissions);
    res.json(user);
  }
}
