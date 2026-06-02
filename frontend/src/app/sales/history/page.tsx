import type { Metadata } from "next";
import { SalesHistoryClient } from "./SalesHistoryClient";

export const metadata: Metadata = {
  title: "Historial de Ventas | MEPSS ERP",
  description: "Consulta ventas registradas, clientes y productos comprados."
};

export default function SalesHistoryPage() {
  return <SalesHistoryClient />;
}
