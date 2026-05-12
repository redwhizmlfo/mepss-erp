import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShoppingCart,
  Siren,
  Truck,
  UsersRound
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    permission: "dashboard",
    children: ["Resumen ejecutivo", "Ventas", "Inventario", "Empleados", "Alertas"]
  },
  {
    label: "Ventas",
    path: "/sales/pos",
    icon: ShoppingCart,
    permission: "ventas",
    children: ["Punto de venta", "Historial", "Comprobantes", "Cierres"]
  },
  {
    label: "Inventario",
    path: "/inventory/products",
    icon: Boxes,
    permission: "inventario",
    children: ["Productos", "Categorias", "Stock", "Kardex", "Ajustes"]
  },
  {
    label: "Proveedores y pedidos",
    path: "/suppliers",
    icon: Truck,
    permission: "proveedores",
    children: ["Proveedores", "Pedidos", "Recepcion", "Historial"]
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
    children: ["Lista", "Asistencias", "Salarios", "Boletas"]
  },
  {
    label: "Perdidas",
    path: "/losses",
    icon: Siren,
    permission: "perdidas",
    children: ["Registrar", "Historial", "Motivos"]
  },
  {
    label: "Reportes",
    path: "/reports",
    icon: BarChart3,
    permission: "reportes",
    children: ["Ventas", "Inventario", "Nomina", "Exportar"]
  },
  {
    label: "Administracion",
    path: "/admin/users",
    icon: Settings,
    permission: "usuarios",
    children: ["Usuarios", "Roles", "Permisos", "Auditoria"]
  }
];
