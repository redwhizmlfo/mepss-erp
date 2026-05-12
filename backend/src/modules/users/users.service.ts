import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma.js";
import { HttpError } from "../../shared/http-error.js";

type PermissionInput = {
  moduleKey: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

function sanitizeUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function includeUserRelations() {
  return {
    role: true,
    employee: true,
    permissions: {
      orderBy: { moduleKey: "asc" as const }
    }
  };
}

export async function listRoles() {
  return prisma.role.findMany({
    orderBy: { name: "asc" }
  });
}

export async function listUsers(params: { q?: string; active?: boolean; page: number; pageSize: number }) {
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

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      include: includeUserRelations(),
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize
    })
  ]);

  return {
    data: users.map(sanitizeUser),
    meta: {
      total,
      page: params.page,
      pageSize: params.pageSize,
      pageCount: Math.ceil(total / params.pageSize)
    }
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: includeUserRelations()
  });

  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  return sanitizeUser(user);
}

export async function createUser(input: {
  username: string;
  password: string;
  roleId: string;
  employeeId?: string | null;
  active: boolean;
  permissions: PermissionInput[];
}) {
  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          username: input.username,
          passwordHash,
          roleId: input.roleId,
          employeeId: input.employeeId ?? null,
          active: input.active
        }
      });

      if (input.permissions.length) {
        await tx.userPermission.createMany({
          data: input.permissions.map((permission) => ({
            userId: created.id,
            ...permission
          }))
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id: created.id },
        include: includeUserRelations()
      });
    });

    return sanitizeUser(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "El username ya existe");
    }
    throw error;
  }
}

export async function updateUser(
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
    const user = await prisma.user.update({
      where: { id },
      data: {
        username: input.username,
        passwordHash,
        roleId: input.roleId,
        employeeId: input.employeeId,
        active: input.active
      },
      include: includeUserRelations()
    });

    return sanitizeUser(user);
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

export async function updateUserStatus(id: string, active: boolean) {
  return updateUser(id, { active });
}

export async function replaceUserPermissions(id: string, permissions: PermissionInput[]) {
  await getUserById(id);

  const user = await prisma.$transaction(async (tx) => {
    await tx.userPermission.deleteMany({
      where: { userId: id }
    });

    if (permissions.length) {
      await tx.userPermission.createMany({
        data: permissions.map((permission) => ({
          userId: id,
          ...permission
        }))
      });
    }

    return tx.user.findUniqueOrThrow({
      where: { id },
      include: includeUserRelations()
    });
  });

  return sanitizeUser(user);
}
