"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, PackageSearch, ReceiptText, RefreshCcw, Search } from "lucide-react";
import { listSalesHistory, SaleHistoryRecord } from "@/lib/api";

function money(value: number | string) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function SalesHistoryView({ token }: { token: string }) {
  const [sales, setSales] = useState<SaleHistoryRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => sales.find((sale) => sale.id === selectedId) ?? sales[0] ?? null,
    [sales, selectedId]
  );

  const totals = useMemo(() => {
    return sales.reduce(
      (acc, sale) => ({
        sales: acc.sales + 1,
        products: acc.products + sale.details.reduce((sum, item) => sum + Number(item.quantity), 0),
        amount: acc.amount + Number(sale.total)
      }),
      { sales: 0, products: 0, amount: 0 }
    );
  }, [sales]);

  async function loadSales() {
    setLoading(true);
    setError(null);
    try {
      const data = await listSalesHistory(token, { q: query, from, to, take: 120 });
      setSales(data);
      setSelectedId((current) => (current && data.some((sale) => sale.id === current) ? current : data[0]?.id ?? null));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el historial de ventas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales();
  }, [token]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadSales();
  }

  return (
    <section className="dashboard modulePage salesHistoryPage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Ventas</p>
          <h1>Historial de ventas</h1>
        </div>
        <div className="moduleTabs" aria-label="Submodulos de ventas">
          <a href="/sales">Panel</a>
          <a href="/sales/pos">Punto de venta</a>
          <a className="active" href="/sales/history">Historial</a>
        </div>
      </div>

      <form className="salesHistoryFilters" onSubmit={handleSubmit}>
        <label>
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por cliente, serie o producto" />
        </label>
        <label>
          <CalendarDays size={16} />
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          <CalendarDays size={16} />
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
        <button className="tableAction" type="submit">
          <RefreshCcw size={15} />
          Filtrar
        </button>
      </form>

      <div className="salesHistorySummary">
        <article>
          <span>Ventas</span>
          <strong>{totals.sales}</strong>
        </article>
        <article>
          <span>Productos vendidos</span>
          <strong>{totals.products}</strong>
        </article>
        <article>
          <span>Total vendido</span>
          <strong>{money(totals.amount)}</strong>
        </article>
      </div>

      {error ? <p className="formNote">{error}</p> : null}

      <div className="salesHistoryGrid">
        <section className="panel salesHistoryList">
          <div className="panelHeader">
            <div>
              <h2>Movimientos</h2>
              <p>{loading ? "Cargando ventas..." : `${sales.length} ventas encontradas.`}</p>
            </div>
            <ReceiptText size={22} />
          </div>

          <div className="salesHistoryRows">
            {sales.map((sale) => (
              <button
                className={`salesHistoryRow${selected?.id === sale.id ? " active" : ""}`}
                key={sale.id}
                type="button"
                onClick={() => setSelectedId(sale.id)}
              >
                <span>
                  <strong>{sale.serie}</strong>
                  <small>{sale.client?.name ?? "Cliente general"} - {dateLabel(sale.createdAt)}</small>
                </span>
                <b>{money(sale.total)}</b>
              </button>
            ))}
            {!sales.length && !loading ? <p className="moduleEmpty">Aun no hay ventas registradas.</p> : null}
          </div>
        </section>

        <section className="panel salesHistoryDetail">
          <div className="panelHeader">
            <div>
              <h2>{selected ? selected.serie : "Detalle de compra"}</h2>
              <p>{selected ? `${selected.client?.name ?? "Cliente general"} compro ${selected.details.length} productos.` : "Selecciona una venta para ver sus productos."}</p>
            </div>
            <PackageSearch size={22} />
          </div>

          {selected ? (
            <>
              <div className="salesHistoryMeta">
                <span>Fecha: <strong>{dateLabel(selected.createdAt)}</strong></span>
                <span>Vendedor: <strong>{selected.employee.fullName}</strong></span>
                <span>Pago: <strong>{selected.paymentMethod.name}</strong></span>
                <span>Comprobante: <strong>{selected.voucherType.name}</strong></span>
              </div>

              <div className="adminTableWrap">
                <table className="adminTable">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Modelo</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.details.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.productNameSnapshot}</strong><small>{item.product.slug}</small></td>
                        <td>{item.product.modelCode ?? "Sin modelo"}</td>
                        <td>{Number(item.quantity)} {item.product.unitName}</td>
                        <td>{money(item.unitPrice)}</td>
                        <td>{money(item.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="salesHistoryTotals">
                <span>Subtotal <strong>{money(selected.subtotal)}</strong></span>
                <span>Descuento <strong>{money(selected.discountAmount)}</strong></span>
                <span>Total <strong>{money(selected.total)}</strong></span>
              </div>
            </>
          ) : (
            <p className="moduleEmpty">No hay detalle disponible.</p>
          )}
        </section>
      </div>
    </section>
  );
}
