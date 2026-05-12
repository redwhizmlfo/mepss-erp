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
    children: ["Resumen ejecutivo", "Ventas", "Inventario", "Empleados", "Alertas"]
  },
  {
    label: "Ventas",
    path: "/sales/pos",
    icon: ShoppingCart,
    children: ["Punto de venta", "Historial", "Comprobantes", "Cierres"]
  },
  {
    label: "Inventario",
    path: "/inventory/products",
    icon: Boxes,
    children: ["Productos", "Categorias", "Stock", "Kardex", "Ajustes"]
  },
  {
    label: "Proveedores y pedidos",
    path: "/suppliers",
    icon: Truck,
    children: ["Proveedores", "Pedidos", "Recepcion", "Historial"]
  },
  {
    label: "Clientes",
    path: "/customers",
    icon: UsersRound,
    children: ["Lista", "Historial", "Documentos"]
  },
  {
    label: "Empleados",
    path: "/employees",
    icon: ReceiptText,
    children: ["Lista", "Asistencias", "Salarios", "Boletas"]
  },
  {
    label: "Perdidas",
    path: "/losses",
    icon: Siren,
    children: ["Registrar", "Historial", "Motivos"]
  },
  {
    label: "Reportes",
    path: "/reports",
    icon: BarChart3,
    children: ["Ventas", "Inventario", "Nomina", "Exportar"]
  },
  {
    label: "Administracion",
    path: "/admin",
    icon: Settings,
    children: ["Usuarios", "Roles", "Permisos", "Auditoria"]
  }
];
