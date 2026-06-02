"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BadgePlus, Plus, RefreshCcw, Search, UserRound, X } from "lucide-react";
import {
  createCustomer,
  CustomerDetail,
  CustomerRecord,
  getCustomer,
  listCustomers,
  updateCustomer,
  updateCustomerStatus
} from "@/lib/api";

const emptyForm = {
  documentType: "DNI",
  documentNumber: "",
  name: "",
  address: "",
  phone: "",
  email: ""
};

function money(value: number | string) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CustomersView({ token }: { token: string }) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selected, setSelected] = useState<CustomerDetail | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadCustomers(search = query) {
    setLoading(true);
    const data = await listCustomers(token, search);
    setCustomers(data);
    if (!selected && data[0]) {
      await selectCustomer(data[0].id);
    }
    setLoading(false);
  }

  async function selectCustomer(customerId: string) {
    const detail = await getCustomer(token, customerId);
    setSelected(detail);
  }

  useEffect(() => {
    loadCustomers("").catch((error) => {
      setMessage(error instanceof Error ? error.message : "No se pudo cargar clientes");
      setLoading(false);
    });
  }, [token]);

  const totalSales = useMemo(
    () => selected?.sales.reduce((sum, sale) => sum + Number(sale.total), 0) ?? 0,
    [selected]
  );

  function openNewCustomer() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingId) {
        await updateCustomer(token, editingId, form);
        setMessage("Cliente actualizado correctamente.");
      } else {
        await createCustomer(token, form);
        setMessage("Cliente creado correctamente.");
      }
      setForm(emptyForm);
      setEditingId(null);
      setSelected(null);
      setDrawerOpen(false);
      await loadCustomers("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar cliente");
    } finally {
      setSaving(false);
    }
  }

  function editCustomer(customer: CustomerRecord) {
    setEditingId(customer.id);
    setForm({
      documentType: customer.documentType,
      documentNumber: customer.documentNumber,
      name: customer.name,
      address: customer.address ?? "",
      phone: customer.phone ?? "",
      email: customer.email ?? ""
    });
    setMessage(null);
    setDrawerOpen(true);
  }

  async function toggleStatus(customer: CustomerRecord) {
    await updateCustomerStatus(token, customer.id, !customer.active);
    await loadCustomers(query);
    if (selected?.id === customer.id) {
      await selectCustomer(customer.id);
    }
  }

  return (
    <section className="dashboard modulePage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Clientes y ventas</h1>
        </div>
        <div className="periodTabs" aria-label="Resumen de clientes">
          <button className="active">{customers.length} clientes</button>
          <button>{selected ? money(totalSales) : "S/ 0.00"}</button>
        </div>
      </div>

      <button className={`floatingAction ${drawerOpen ? "open" : ""}`} type="button" onClick={() => (drawerOpen ? closeDrawer() : openNewCustomer())} aria-label={drawerOpen ? "Cerrar formulario de cliente" : "Registrar cliente"}>
        {drawerOpen ? <X size={22} /> : <Plus size={22} />}
      </button>

      <div className={`sideDrawerBackdrop ${drawerOpen ? "open" : ""}`} onClick={closeDrawer} />
      <aside className={`sideDrawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="sideDrawerHeader">
          <div>
            <p className="eyebrow">Registro</p>
            <h2>{editingId ? "Editar cliente" : "Nuevo cliente"}</h2>
          </div>
          <button className="drawerClose" onClick={closeDrawer} type="button" aria-label="Cerrar formulario">
            <X size={20} />
          </button>
        </div>

        <form className="adminForm drawerForm" onSubmit={handleSubmit}>
          <label>
            <span>Tipo documento</span>
            <select value={form.documentType} onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))}>
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">CE</option>
            </select>
          </label>
          <label>
            <span>Número documento</span>
            <input value={form.documentNumber} onChange={(event) => setForm((current) => ({ ...current, documentNumber: event.target.value }))} required />
          </label>
          <label>
            <span>Nombre</span>
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label>
            <span>Teléfono</span>
            <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </label>
          <label>
            <span>Correo</span>
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label>
            <span>Dirección</span>
            <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
          </label>
          {message ? <p className="formNote">{message}</p> : null}
          <button className="loginButton" type="submit" disabled={saving}>
            <span>{saving ? "Guardando..." : editingId ? "Actualizar cliente" : "Crear cliente"}</span>
            <BadgePlus size={18} />
          </button>
        </form>
      </aside>

      <section className="panel wide">
        <div className="panelHeader">
          <div>
            <h2>Directorio de clientes</h2>
            <p>Clientes registrados y cantidad de ventas.</p>
          </div>
          <div className="moduleSearch">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadCustomers(query)} placeholder="Buscar cliente" />
            <button className="tableAction" onClick={() => loadCustomers(query)} type="button">
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>

        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Contacto</th>
                <th>Ventas</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <small>{customer.address || "Sin dirección"}</small>
                  </td>
                  <td>{customer.documentType} {customer.documentNumber}</td>
                  <td>
                    <strong>{customer.phone || "-"}</strong>
                    <small>{customer.email || "Sin correo"}</small>
                  </td>
                  <td>{customer._count?.sales ?? 0}</td>
                  <td><span className={`statusPill ${customer.active ? "active" : "inactive"}`}>{customer.active ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <button className="tableAction" onClick={() => selectCustomer(customer.id)}>Ventas</button>
                    <button className="tableAction" onClick={() => editCustomer(customer)}>Editar</button>
                    <button className="tableAction" onClick={() => toggleStatus(customer)}>{customer.active ? "Desactivar" : "Activar"}</button>
                  </td>
                </tr>
              ))}
              {!customers.length && !loading ? (
                <tr><td colSpan={6}>No hay clientes registrados.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel moduleDetail">
        <div className="panelHeader">
          <div>
            <h2>{selected ? selected.name : "Ventas del cliente"}</h2>
            <p>{selected ? `${selected.sales.length} ventas registradas. Total ${money(totalSales)}.` : "Selecciona un cliente para ver sus ventas."}</p>
          </div>
          <UserRound size={22} />
        </div>

        <div className="moduleCards">
          {selected?.sales.map((sale) => (
            <article className="moduleCard" key={sale.id}>
              <span>{sale.serie}</span>
              <strong>{money(sale.total)}</strong>
              <small>{new Date(sale.createdAt).toLocaleDateString("es-PE")} · {sale.paymentMethod.name}</small>
            </article>
          ))}
          {selected && !selected.sales.length ? <p className="moduleEmpty">Este cliente aún no tiene ventas.</p> : null}
        </div>
      </section>
    </section>
  );
}
