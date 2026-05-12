import { z } from "zod";

const permissionSchema = z.object({
  moduleKey: z.string().min(2),
  canView: z.boolean().default(false),
  canCreate: z.boolean().default(false),
  canEdit: z.boolean().default(false),
  canDelete: z.boolean().default(false)
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(80),
  password: z.string().min(6),
  roleId: z.string().uuid(),
  employeeId: z.string().uuid().nullable().optional(),
  active: z.boolean().default(true),
  permissions: z.array(permissionSchema).default([])
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(80).optional(),
  password: z.string().min(6).optional(),
  roleId: z.string().uuid().optional(),
  employeeId: z.string().uuid().nullable().optional(),
  active: z.boolean().optional()
});

export const updateUserStatusSchema = z.object({
  active: z.boolean()
});

export const updateUserPermissionsSchema = z.object({
  permissions: z.array(permissionSchema)
});

export const listUsersQuerySchema = z.object({
  q: z.string().optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20)
});
