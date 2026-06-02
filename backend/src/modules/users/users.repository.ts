import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma.js";

type PermissionInput = {
  moduleKey: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export class UserRepository {
  private includeUserRelations() {
    return {
      role: true,
      employee: true,
      permissions: {
        orderBy: { moduleKey: "asc" as const }
      }
    };
  }

  public async listRoles() {
    return prisma.role.findMany({
      orderBy: { name: "asc" }
    });
  }

  public async countUsers(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  }

  public async findUsers(where: Prisma.UserWhereInput, skip: number, take: number) {
    return prisma.user.findMany({
      where,
      include: this.includeUserRelations(),
      orderBy: { createdAt: "desc" },
      skip,
      take
    });
  }

  public async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: this.includeUserRelations()
    });
  }

  public async createUserWithPermissions(
    userData: Omit<Prisma.UserCreateInput, "role" | "employee" | "permissions" | "inventoryMovements" | "payrollCreated" | "supplierOrders"> & {
      roleId: string;
      employeeId?: string | null;
    },
    permissions: PermissionInput[]
  ) {
    return prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          username: userData.username,
          passwordHash: userData.passwordHash,
          roleId: userData.roleId,
          employeeId: userData.employeeId ?? null,
          active: userData.active
        }
      });

      if (permissions.length) {
        await tx.userPermission.createMany({
          data: permissions.map((permission) => ({
            userId: created.id,
            ...permission
          }))
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id: created.id },
        include: this.includeUserRelations()
      });
    });
  }

  public async updateUser(
    id: string,
    data: Prisma.UserUncheckedUpdateInput
  ) {
    return prisma.user.update({
      where: { id },
      data,
      include: this.includeUserRelations()
    });
  }

  public async replaceUserPermissions(id: string, permissions: PermissionInput[]) {
    return prisma.$transaction(async (tx) => {
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
        include: this.includeUserRelations()
      });
    });
  }
}
