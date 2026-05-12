import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "./prisma.js";
import { HttpError } from "./http-error.js";

export type AuthUser = {
  id: string;
  username: string;
  roleCode: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type JwtPayload = {
  sub: string;
  username: string;
  roleCode: string;
};

export function signAccessToken(user: AuthUser) {
  return jwt.sign(
    {
      username: user.username,
      roleCode: user.roleCode
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: "8h"
    }
  );
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    next(new HttpError(401, "Token requerido"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      id: payload.sub,
      username: payload.username,
      roleCode: payload.roleCode
    };
    next();
  } catch {
    next(new HttpError(401, "Token invalido o expirado"));
  }
}

export function requirePermission(
  moduleKey: string,
  action: "canView" | "canCreate" | "canEdit" | "canDelete" = "canView"
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpError(401, "Usuario no autenticado"));
      return;
    }

    if (req.user.roleCode === "admin") {
      next();
      return;
    }

    const permission = await prisma.userPermission.findUnique({
      where: {
        userId_moduleKey: {
          userId: req.user.id,
          moduleKey
        }
      }
    });

    if (!permission?.[action]) {
      next(new HttpError(403, "Permiso insuficiente"));
      return;
    }

    next();
  };
}
