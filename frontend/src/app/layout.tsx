import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEPSS ERP",
  description: "Panel operativo para ventas, inventario, proveedores, empleados y reportes."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
