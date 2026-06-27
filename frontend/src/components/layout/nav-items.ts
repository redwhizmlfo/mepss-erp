import {
  Boxes,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShoppingCart,
  UsersRound
} from "lucide-react";

export const navItems = [
  {
    label: "Panel Principal",
    path: "/",
    icon: LayoutDashboard,
    permission: "dashboard",
    children: ["Resumen ejecutivo", "Ventas", "Inventario", "Empleados", "Alertas"]
  },
  {
    label: "Ventas",
    path: "/sales",
    icon: ShoppingCart,
    permission: "ventas",
    children: ["Punto de venta", "Historial", "Comprobantes", "Cierres"],
    subItems: [
      { label: "Punto de venta", path: "/sales/pos" },
      { label: "Historial de ventas", path: "/sales/history" }
    ]
  },
  {
    label: "Inventario",
    path: "/inventory/products",
    icon: Boxes,
    permission: "inventario",
    children: ["Productos", "Categorias", "Stock", "Kardex", "Ajustes"]
  },
  {
    label: "Clientes",
    path: "/customers",
    icon: UsersRound,
    permission: "clientes",
    children: ["Lista", "Historial", "Documentos"]
  },
  {
    label: "Empleados",
    path: "/employees",
    icon: ReceiptText,
    permission: "empleados",
    children: ["Lista", "Asistencias", "Boletas"]
  },
  {
    label: "Administracion",
    path: "/admin/users",
    icon: Settings,
    permission: "usuarios",
    children: ["Usuarios", "Roles", "Permisos", "Auditoria"]
  }
];
