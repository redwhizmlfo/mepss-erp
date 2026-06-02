import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { HttpError } from "../../shared/http-error.js";
import { UserRepository } from "./users.repository.js";

type PermissionInput = {
  moduleKey: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private sanitizeUser<T extends { passwordHash?: string }>(user: T) {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public async listRoles() {
    return this.userRepository.listRoles();
  }

  public async listUsers(params: { q?: string; active?: boolean; page: number; pageSize: number }) {
    const where: Prisma.UserWhereInput = {
      active: params.active,
      ...(params.q
        ? {
            OR: [
              { username: { contains: params.q, mode: "insensitive" } },
              { employee: { fullName: { contains: params.q, mode: "insensitive" } } }
            ]
          }
        : {})
    };

    const skip = (params.page - 1) * params.pageSize;
    
    const [total, users] = await Promise.all([
      this.userRepository.countUsers(where),
      this.userRepository.findUsers(where, skip, params.pageSize)
    ]);

    return {
      data: users.map((u) => this.sanitizeUser(u)),
      meta: {
        total,
        page: params.page,
        pageSize: params.pageSize,
        pageCount: Math.ceil(total / params.pageSize)
      }
    };
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpError(404, "Usuario no encontrado");
    }

    return this.sanitizeUser(user);
  }

  public async createUser(input: {
    username: string;
    password: string;
    roleId: string;
    employeeId?: string | null;
    active: boolean;
    permissions: PermissionInput[];
  }) {
    const passwordHash = await bcrypt.hash(input.password, 12);

    try {
      const user = await this.userRepository.createUserWithPermissions(
        {
          username: input.username,
          passwordHash,
          roleId: input.roleId,
          employeeId: input.employeeId ?? null,
          active: input.active
        },
        input.permissions
      );

      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new HttpError(409, "El username ya existe");
      }
      throw error;
    }
  }

  public async updateUser(
    id: string,
    input: {
      username?: string;
      password?: string;
      roleId?: string;
      employeeId?: string | null;
      active?: boolean;
    }
  ) {
    const passwordHash = input.password ? await bcrypt.hash(input.password, 12) : undefined;

    try {
      const user = await this.userRepository.updateUser(id, {
        username: input.username,
        passwordHash,
        roleId: input.roleId,
        employeeId: input.employeeId,
        active: input.active
      });

      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new HttpError(404, "Usuario no encontrado");
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new HttpError(409, "El username ya existe");
      }
      throw error;
    }
  }

  public async updateUserStatus(id: string, active: boolean) {
    return this.updateUser(id, { active });
  }

  public async replaceUserPermissions(id: string, permissions: PermissionInput[]) {
    await this.getUserById(id); // Valida que exista

    const user = await this.userRepository.replaceUserPermissions(id, permissions);

    return this.sanitizeUser(user);
  }
}
