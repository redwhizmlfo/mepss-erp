import type { Metadata } from "next";
import { SalesPosFull } from "./SalesPosFull";

export const metadata: Metadata = {
  title: "Punto de Venta | Luxury Ops Suite",
  description: "Registra ventas, selecciona productos, elige método de pago y emite comprobantes."
};

export default function SalesPosPage() {
  return <SalesPosFull />;
}
