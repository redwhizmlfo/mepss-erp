import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma.js";
import { HttpError } from "../../shared/http-error.js";
import { signAccessToken } from "../../shared/auth-middleware.js";

export async function login(input: { username: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { username: input.username },
    select: {
      id: true,
      username: true,
      passwordHash: true,
      active: true,
      role: { select: { code: true, name: true } },
      employee: { select: { id: true, fullName: true, position: true } },
      permissions: {
        select: {
          moduleKey: true,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        }
      }
    }
  });

  if (!user || !user.active) {
    throw new HttpError(401, "Credenciales invalidas");
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);

  if (!validPassword) {
    throw new HttpError(401, "Credenciales invalidas");
  }

  void prisma.user.update({
    where: { id: user.id },
    data: { lastAccessAt: new Date() }
  }).catch(() => undefined);

  const authUser = {
    id: user.id,
    username: user.username,
    roleCode: user.role.code
  };

  return {
    accessToken: signAccessToken(authUser),
    user: {
      ...authUser,
      roleName: user.role.name,
      employee: user.employee
        ? {
            id: user.employee.id,
            fullName: user.employee.fullName,
            position: user.employee.position
          }
        : null,
      permissions: user.permissions.map((permission) => ({
        moduleKey: permission.moduleKey,
        canView: permission.canView,
        canCreate: permission.canCreate,
        canEdit: permission.canEdit,
        canDelete: permission.canDelete
      }))
    }
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      active: true,
      role: { select: { code: true, name: true } },
      employee: { select: { id: true, fullName: true, position: true } },
      permissions: {
        select: {
          moduleKey: true,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        }
      }
    }
  });

  if (!user || !user.active) {
    throw new HttpError(401, "Usuario no disponible");
  }

  return {
    id: user.id,
    username: user.username,
    roleCode: user.role.code,
    roleName: user.role.name,
    employee: user.employee
      ? {
          id: user.employee.id,
          fullName: user.employee.fullName,
          position: user.employee.position
        }
      : null,
    permissions: user.permissions.map((permission) => ({
      moduleKey: permission.moduleKey,
      canView: permission.canView,
      canCreate: permission.canCreate,
      canEdit: permission.canEdit,
      canDelete: permission.canDelete
    }))
  };
}
