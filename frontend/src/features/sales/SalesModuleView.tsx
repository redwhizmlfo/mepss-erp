"use client";

import { BarChart3, ReceiptText, ShoppingCart } from "lucide-react";

export function SalesModuleView() {
  return (
    <section className="dashboard modulePage salesModulePage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Modulo</p>
          <h1>Ventas</h1>
        </div>
        <div className="moduleTabs" aria-label="Submodulos de ventas">
          <a className="active" href="/sales">Panel</a>
          <a href="/sales/pos">Punto de venta</a>
          <a href="/sales/history">Historial</a>
        </div>
      </div>

      <div className="salesModuleHero">
        <div>
          <span>Operacion comercial</span>
          <h2>Gestiona ventas, compras de clientes y comprobantes desde un solo modulo.</h2>
        </div>
        <BarChart3 size={44} />
      </div>

      <div className="salesModuleCards">
        <a className="salesModuleCard primary" href="/sales/pos">
          <span className="salesModuleIcon"><ShoppingCart size={24} /></span>
          <div>
            <small>Submodulo</small>
            <strong>Punto de venta</strong>
            <p>Registra compras de clientes, selecciona productos, calcula totales y emite comprobantes.</p>
          </div>
        </a>

        <a className="salesModuleCard" href="/sales/history">
          <span className="salesModuleIcon"><ReceiptText size={24} /></span>
          <div>
            <small>Submodulo</small>
            <strong>Historial de ventas</strong>
            <p>Consulta movimientos de compra, clientes, productos vendidos, metodos de pago y totales.</p>
          </div>
        </a>
      </div>
    </section>
  );
}
