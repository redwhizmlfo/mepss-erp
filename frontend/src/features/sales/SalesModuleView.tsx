"use client";

import { BarChart3 } from "lucide-react";

export function SalesModuleView() {
  return (
    <section className="dashboard modulePage salesModulePage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Modulo</p>
          <h1>Ventas</h1>
        </div>
      </div>

      <div className="salesModuleHero">
        <div>
          <span>Operacion comercial</span>
          <h2>Gestiona ventas, compras de clientes y comprobantes desde un solo modulo.</h2>
        </div>
        <BarChart3 size={44} />
      </div>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Submodulos en el panel lateral</h2>
            <p>Usa el desglose de Ventas en el navbar para entrar a Punto de venta o Historial de ventas.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
