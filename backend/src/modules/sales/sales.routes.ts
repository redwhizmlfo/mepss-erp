import { Router } from "express";
import { prisma } from "../../shared/prisma.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { HttpError } from "../../shared/http-error.js";
import { authenticate } from "../../shared/auth-middleware.js";

export const salesRouter = Router();

// Todas las rutas de ventas requieren autenticación
salesRouter.use(authenticate);

// 0. Historial de ventas con productos comprados
salesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = req.query.q as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const take = Math.min(Number(req.query.take ?? 80), 200);

    const where: any = {};

    if (from || to) {
      where.saleDate = {};
      if (from) where.saleDate.gte = new Date(from);
      if (to) where.saleDate.lte = new Date(to);
    }

    if (q) {
      where.OR = [
        { serie: { contains: q, mode: "insensitive" } },
        { client: { name: { contains: q, mode: "insensitive" } } },
        { client: { documentNumber: { contains: q, mode: "insensitive" } } },
        { employee: { fullName: { contains: q, mode: "insensitive" } } },
        { details: { some: { productNameSnapshot: { contains: q, mode: "insensitive" } } } }
      ];
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        voucherType: true,
        paymentMethod: true,
        client: true,
        employee: true,
        details: {
          orderBy: { createdAt: "asc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                modelCode: true,
                unitName: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    res.json(sales);
  })
);

// 1. Obtener métodos de pago activos
salesRouter.get(
  "/payment-methods",
  asyncHandler(async (_req, res) => {
    const methods = await prisma.paymentMethod.findMany({
      where: { active: true },
      orderBy: { name: "asc" }
    });
    res.json(methods);
  })
);

// 2. Obtener tipos de comprobante activos
salesRouter.get(
  "/voucher-types",
  asyncHandler(async (_req, res) => {
    const types = await prisma.voucherType.findMany({
      where: { active: true },
      orderBy: { name: "asc" }
    });
    res.json(types);
  })
);

// 3. Buscar clientes activos por nombre o documento
salesRouter.get(
  "/customers",
  asyncHandler(async (req, res) => {
    const q = req.query.q as string | undefined;
    const where: any = { active: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { documentNumber: { contains: q, mode: "insensitive" } }
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: "asc" },
      take: 20
    });
    res.json(customers);
  })
);

// 4. Crear una venta (checkout)
salesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new HttpError(401, "No autenticado");
    }

    const {
      clientId,
      paymentMethodId,
      voucherTypeId,
      discountPct = 0,
      amountReceived = 0,
      note,
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, "La venta debe incluir al menos un producto.");
    }

    // 1. Obtener el empleado asociado al usuario logueado
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.employeeId) {
      throw new HttpError(400, "El usuario no tiene un empleado asociado para registrar ventas.");
    }

    const employeeId = user.employeeId;

    // 2. Obtener tipo de comprobante para generar la serie
    const voucherType = await prisma.voucherType.findUnique({
      where: { id: voucherTypeId }
    });

    if (!voucherType) {
      throw new HttpError(400, "Tipo de comprobante no válido.");
    }

    // 3. Obtener el método de pago
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });

    if (!paymentMethod) {
      throw new HttpError(400, "Método de pago no válido.");
    }

    // 4. Procesar y validar productos de la venta
    const processedItems: Array<{
      productId: string;
      productNameSnapshot: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      costPrice: number | null;
      newStock: number;
    }> = [];
    let subtotalSum = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new HttpError(404, `Producto con ID ${item.productId} no encontrado.`);
      }

      if (!product.active) {
        throw new HttpError(400, `El producto ${product.name} no está activo.`);
      }

      const requestedQty = Number(item.quantity);
      if (isNaN(requestedQty) || requestedQty <= 0) {
        throw new HttpError(400, `Cantidad inválida para el producto ${product.name}.`);
      }

      // Validar stock disponible
      const currentStock = Number(product.stock);
      if (currentStock < requestedQty) {
        throw new HttpError(400, `Stock insuficiente para ${product.name}. Disponible: ${currentStock}, Solicitado: ${requestedQty}`);
      }

      const salePrice = Number(product.salePrice);
      const lineTotal = requestedQty * salePrice;
      subtotalSum += lineTotal;

      processedItems.push({
        productId: product.id,
        productNameSnapshot: product.name,
        quantity: requestedQty,
        unitPrice: salePrice,
        lineTotal: lineTotal,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        newStock: currentStock - requestedQty
      });
    }

    // 5. Cálculos financieros finales
    const subtotal = subtotalSum;
    const discountAmount = subtotal * (Number(discountPct) / 100);
    const total = subtotal - discountAmount;
    const changeAmount = Number(amountReceived) >= total ? Number(amountReceived) - total : 0;

    // 6. Generar serie incremental única de venta
    const salesCount = await prisma.sale.count({
      where: { voucherTypeId }
    });
    const prefix = voucherType.seriesPrefix || "V001";
    const nextNumber = String(salesCount + 1).padStart(8, "0");
    const serie = `${prefix}-${nextNumber}`;

    // 7. Ejecutar transacción atómica de base de datos
    const saleResult = await prisma.$transaction(async (tx) => {
      // a) Crear la venta
      const createdSale = await tx.sale.create({
        data: {
          serie,
          voucherTypeId,
          paymentMethodId,
          clientId: clientId || null,
          employeeId,
          saleDate: new Date(),
          saleTime: new Date(),
          subtotal,
          discountPct,
          discountAmount,
          total,
          amountReceived,
          changeAmount,
          note: note || null
        }
      });

      // b) Para cada producto: crear detalle, restar stock, registrar kardex
      for (const item of processedItems) {
        // Crear detalle de venta
        await tx.saleDetail.create({
          data: {
            saleId: createdSale.id,
            productId: item.productId,
            productNameSnapshot: item.productNameSnapshot,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal
          }
        });

        // Restar stock en la tabla de productos
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: item.newStock }
        });

        // Registrar movimiento de inventario (kardex)
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            movementType: "sale_out",
            referenceType: "Sale",
            referenceId: createdSale.id,
            quantity: item.quantity,
            unitCost: item.costPrice,
            note: `Venta POS serie ${serie}`,
            createdByUserId: req.user?.id
          }
        });
      }

      // c) Retornar la venta completa con detalles cargados
      return tx.sale.findUniqueOrThrow({
        where: { id: createdSale.id },
        include: {
          details: true,
          voucherType: true,
          paymentMethod: true,
          client: true,
          employee: true
        }
      });
    });

    res.status(201).json(saleResult);
  })
);
