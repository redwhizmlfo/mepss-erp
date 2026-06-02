import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { authenticate, requirePermission } from "../../shared/auth-middleware.js";
import { HttpError } from "../../shared/http-error.js";
import { prisma } from "../../shared/prisma.js";

export const employeesRouter = Router();

employeesRouter.use(authenticate);

const employeeSchema = z.object({
  fullName: z.string().min(2).max(160),
  dni: z.string().min(8).max(20),
  position: z.string().min(2).max(120),
  phone: z.string().max(40).optional().nullable(),
  hireDate: z.string().min(10),
  dailyPay: z.coerce.number().min(0)
});

const attendanceSchema = z.object({
  workDate: z.string().min(10),
  checkInTime: z.string().optional().nullable(),
  checkOutTime: z.string().optional().nullable(),
  status: z.enum(["asistio", "falto", "en_turno", "pendiente"]),
  source: z.string().default("manual")
});

const payrollSchema = z.object({
  periodYear: z.coerce.number().int().min(2020),
  periodMonth: z.coerce.number().int().min(1).max(12),
  discounts: z.coerce.number().min(0).default(0)
});

function dateOnly(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

function timeOnly(value?: string | null) {
  if (!value) return null;
  return new Date(`1970-01-01T${value}:00.000Z`);
}

employeesRouter.get(
  "/",
  requirePermission("empleados"),
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? "").trim();

    const employees = await prisma.employee.findMany({
      where: q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { dni: { contains: q, mode: "insensitive" } },
              { position: { contains: q, mode: "insensitive" } }
            ]
          }
        : undefined,
      include: {
        users: { select: { id: true, username: true, active: true, role: true } },
        _count: { select: { sales: true, attendance: true, payroll: true } }
      },
      orderBy: { fullName: "asc" },
      take: 80
    });

    res.json(employees);
  })
);

employeesRouter.post(
  "/",
  requirePermission("empleados", "canCreate"),
  asyncHandler(async (req, res) => {
    const input = employeeSchema.parse(req.body);
    const employee = await prisma.employee.create({
      data: {
        fullName: input.fullName,
        dni: input.dni,
        position: input.position,
        phone: input.phone || null,
        hireDate: dateOnly(input.hireDate),
        dailyPay: input.dailyPay
      }
    });

    res.status(201).json(employee);
  })
);

employeesRouter.get(
  "/:id",
  requirePermission("empleados"),
  asyncHandler(async (req, res) => {
    const employee = await prisma.employee.findUnique({
      where: { id: String(req.params.id) },
      include: {
        users: { select: { id: true, username: true, active: true, role: true } },
        sales: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { client: true, paymentMethod: true, voucherType: true }
        },
        attendance: { orderBy: { workDate: "desc" }, take: 31 },
        payroll: { orderBy: { createdAt: "desc" }, take: 12 }
      }
    });

    if (!employee) {
      throw new HttpError(404, "Empleado no encontrado");
    }

    res.json(employee);
  })
);

employeesRouter.put(
  "/:id",
  requirePermission("empleados", "canEdit"),
  asyncHandler(async (req, res) => {
    const input = employeeSchema.parse(req.body);
    const employee = await prisma.employee.update({
      where: { id: String(req.params.id) },
      data: {
        fullName: input.fullName,
        dni: input.dni,
        position: input.position,
        phone: input.phone || null,
        hireDate: dateOnly(input.hireDate),
        dailyPay: input.dailyPay
      }
    });

    res.json(employee);
  })
);

employeesRouter.patch(
  "/:id/status",
  requirePermission("empleados", "canEdit"),
  asyncHandler(async (req, res) => {
    const active = z.object({ active: z.boolean() }).parse(req.body).active;
    const employee = await prisma.employee.update({
      where: { id: String(req.params.id) },
      data: { active }
    });

    res.json(employee);
  })
);

employeesRouter.post(
  "/:id/attendance",
  requirePermission("asistencias", "canCreate"),
  asyncHandler(async (req, res) => {
    const input = attendanceSchema.parse(req.body);
    const attendance = await prisma.employeeAttendance.upsert({
      where: {
        employeeId_workDate: {
          employeeId: String(req.params.id),
          workDate: dateOnly(input.workDate)
        }
      },
      update: {
        checkInTime: timeOnly(input.checkInTime),
        checkOutTime: timeOnly(input.checkOutTime),
        status: input.status,
        source: input.source
      },
      create: {
        employeeId: String(req.params.id),
        workDate: dateOnly(input.workDate),
        checkInTime: timeOnly(input.checkInTime),
        checkOutTime: timeOnly(input.checkOutTime),
        status: input.status,
        source: input.source
      }
    });

    res.status(201).json(attendance);
  })
);

employeesRouter.post(
  "/:id/payroll",
  requirePermission("boletas_pago", "canCreate"),
  asyncHandler(async (req, res) => {
    const input = payrollSchema.parse(req.body);
    const employee = await prisma.employee.findUnique({ where: { id: String(req.params.id) } });

    if (!employee) {
      throw new HttpError(404, "Empleado no encontrado");
    }

    const start = new Date(Date.UTC(input.periodYear, input.periodMonth - 1, 1));
    const end = new Date(Date.UTC(input.periodYear, input.periodMonth, 1));
    const attendance = await prisma.employeeAttendance.findMany({
      where: {
        employeeId: employee.id,
        workDate: { gte: start, lt: end },
        status: "asistio"
      }
    });

    const daysWorked = attendance.length;
    const dailyPay = Number(employee.dailyPay);
    const subtotal = daysWorked * dailyPay;
    const netTotal = Math.max(0, subtotal - input.discounts);
    const slipNumber = `BOL-${input.periodYear}${String(input.periodMonth).padStart(2, "0")}-${employee.dni}`;

    const payroll = await prisma.payrollSlip.upsert({
      where: { slipNumber },
      update: {
        daysWorked,
        dailyPay,
        subtotal,
        discounts: input.discounts,
        netTotal,
        createdByUserId: req.user?.id
      },
      create: {
        slipNumber,
        employeeId: employee.id,
        periodYear: input.periodYear,
        periodMonth: input.periodMonth,
        issueDate: new Date(),
        daysWorked,
        dailyPay,
        subtotal,
        discounts: input.discounts,
        netTotal,
        createdByUserId: req.user?.id,
        details: {
          create: attendance.map((item) => ({
            workDate: item.workDate,
            checkInTime: item.checkInTime,
            checkOutTime: item.checkOutTime,
            amount: dailyPay
          }))
        }
      },
      include: { details: true }
    });

    res.status(201).json(payroll);
  })
);
