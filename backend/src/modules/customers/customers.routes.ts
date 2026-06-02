import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { authenticate, requirePermission } from "../../shared/auth-middleware.js";
import { HttpError } from "../../shared/http-error.js";
import { prisma } from "../../shared/prisma.js";

export const customersRouter = Router();

customersRouter.use(authenticate);

const customerSchema = z.object({
  documentType: z.string().min(1).max(20),
  documentNumber: z.string().min(3).max(30),
  name: z.string().min(2).max(180),
  address: z.string().max(220).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable()
});

customersRouter.get(
  "/",
  requirePermission("clientes"),
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? "").trim();

    const customers = await prisma.customer.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { documentNumber: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } }
            ]
          }
        : undefined,
      include: {
        _count: { select: { sales: true } },
        sales: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, serie: true, total: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 80
    });

    res.json(customers);
  })
);

customersRouter.post(
  "/",
  requirePermission("clientes", "canCreate"),
  asyncHandler(async (req, res) => {
    const input = customerSchema.parse(req.body);

    const customer = await prisma.customer.create({
      data: {
        ...input,
        email: input.email || null,
        address: input.address || null,
        phone: input.phone || null
      }
    });

    res.status(201).json(customer);
  })
);

customersRouter.get(
  "/:id",
  requirePermission("clientes"),
  asyncHandler(async (req, res) => {
    const customer = await prisma.customer.findUnique({
      where: { id: String(req.params.id) },
      include: {
        sales: {
          orderBy: { createdAt: "desc" },
          include: {
            paymentMethod: true,
            voucherType: true,
            employee: true,
            details: true
          }
        }
      }
    });

    if (!customer) {
      throw new HttpError(404, "Cliente no encontrado");
    }

    res.json(customer);
  })
);

customersRouter.put(
  "/:id",
  requirePermission("clientes", "canEdit"),
  asyncHandler(async (req, res) => {
    const input = customerSchema.parse(req.body);

    const customer = await prisma.customer.update({
      where: { id: String(req.params.id) },
      data: {
        ...input,
        email: input.email || null,
        address: input.address || null,
        phone: input.phone || null
      }
    });

    res.json(customer);
  })
);

customersRouter.patch(
  "/:id/status",
  requirePermission("clientes", "canEdit"),
  asyncHandler(async (req, res) => {
    const active = z.object({ active: z.boolean() }).parse(req.body).active;
    const customer = await prisma.customer.update({
      where: { id: String(req.params.id) },
      data: { active }
    });

    res.json(customer);
  })
);
