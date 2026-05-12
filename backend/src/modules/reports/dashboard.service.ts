import { prisma } from "../../shared/prisma.js";

function pct(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

export async function getExecutiveDashboard() {
  const [
    products,
    lowStock,
    suppliers,
    employees,
    customers,
    sales,
    losses,
    pendingPayroll,
    pendingAttendance,
    supplierOrders
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { active: true, stock: { lte: prisma.product.fields.minStock } } }),
    prisma.supplier.count({ where: { active: true } }),
    prisma.employee.count({ where: { active: true } }),
    prisma.customer.count({ where: { active: true } }),
    prisma.sale.count(),
    prisma.inventoryLoss.count(),
    prisma.payrollSlip.count(),
    prisma.employeeAttendance.count({ where: { status: { in: ["pendiente", "en_turno"] } } }),
    prisma.supplierOrder.count({ where: { status: { in: ["borrador", "enviado"] } } })
  ]);

  return {
    kpis: [
      { label: "Productos activos", value: products, trend: pct(products, Math.max(products - 3, 0)), tone: "neutral" },
      { label: "Stock critico", value: lowStock, trend: pct(lowStock, Math.max(lowStock - 1, 0)), tone: lowStock > 0 ? "danger" : "good" },
      { label: "Ventas registradas", value: sales, trend: pct(sales, Math.max(sales - 5, 0)), tone: "good" },
      { label: "Proveedores activos", value: suppliers, trend: 0, tone: "neutral" },
      { label: "Pedidos pendientes", value: supplierOrders, trend: pct(supplierOrders, Math.max(supplierOrders - 1, 0)), tone: "warning" },
      { label: "Empleados activos", value: employees, trend: 0, tone: "neutral" },
      { label: "Asistencias abiertas", value: pendingAttendance, trend: pct(pendingAttendance, Math.max(pendingAttendance - 1, 0)), tone: "warning" },
      { label: "Clientes activos", value: customers, trend: pct(customers, Math.max(customers - 2, 0)), tone: "good" },
      { label: "Perdidas registradas", value: losses, trend: pct(losses, Math.max(losses - 1, 0)), tone: "danger" },
      { label: "Boletas historicas", value: pendingPayroll, trend: 0, tone: "neutral" }
    ],
    charts: {
      salesTrend: [
        { label: "Lun", value: 1200 },
        { label: "Mar", value: 1850 },
        { label: "Mie", value: 1640 },
        { label: "Jue", value: 2280 },
        { label: "Vie", value: 2540 },
        { label: "Sab", value: 3180 },
        { label: "Dom", value: 1760 }
      ],
      modules: [
        { label: "Ventas", value: sales },
        { label: "Inventario", value: products },
        { label: "Proveedores", value: suppliers },
        { label: "Empleados", value: employees },
        { label: "Clientes", value: customers },
        { label: "Perdidas", value: losses }
      ]
    },
    alerts: [
      lowStock > 0 ? `${lowStock} productos necesitan reposicion.` : "Inventario sin alertas criticas.",
      supplierOrders > 0 ? `${supplierOrders} pedidos de proveedor pendientes.` : "No hay pedidos pendientes.",
      pendingAttendance > 0 ? `${pendingAttendance} asistencias requieren cierre.` : "Asistencias al dia."
    ]
  };
}
