import type { Metadata } from "next";
import { SalesModuleClient } from "./SalesModuleClient";

export const metadata: Metadata = {
  title: "Ventas | MEPSS ERP",
  description: "Modulo contenedor de punto de venta e historial comercial."
};

export default function SalesPage() {
  return <SalesModuleClient />;
}
