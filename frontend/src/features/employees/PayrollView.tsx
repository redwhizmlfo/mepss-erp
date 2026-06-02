"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw, Search, X } from "lucide-react";
import { createEmployeePayroll, EmployeeDetail, EmployeeRecord, getEmployee, listEmployees } from "@/lib/api";

function money(value: number | string) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PayrollView({ token }: { token: string }) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [selected, setSelected] = useState<EmployeeDetail | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ periodYear: new Date().getFullYear(), periodMonth: new Date().getMonth() + 1, discounts: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function loadEmployees(search = query) {
    setLoading(true);
    const data = await listEmployees(token, search);
    setEmployees(data);
    if (!selected && data[0]) {
      await selectEmployee(data[0].id);
    }
    setLoading(false);
  }

  async function selectEmployee(employeeId: string) {
    const detail = await getEmployee(token, employeeId);
    setSelected(detail);
  }

  useEffect(() => {
    loadEmployees("").catch((error) => {
      setMessage(error instanceof Error ? error.message : "No se pudo cargar boletas");
      setLoading(false);
    });
  }, [token]);

  const payrollTotal = useMemo(
    () => selected?.payroll.reduce((sum, slip) => sum + Number(slip.netTotal), 0) ?? 0,
    [selected]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    await createEmployeePayroll(token, selected.id, form);
    setMessage("Boleta generada correctamente.");
    setDrawerOpen(false);
    await selectEmployee(selected.id);
    await loadEmployees(query);
  }

  function openDrawer() {
    setMessage(null);
    setDrawerOpen(true);
  }

  return (
    <section className="dashboard modulePage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Boletas</p>
          <h1>Boletas de pago</h1>
        </div>
        <div className="moduleTabs" aria-label="Submódulos de empleados">
          <a href="/employees">Empleados</a>
          <a href="/employees/attendance">Asistencias</a>
          <a className="active" href="/employees/payroll">Boletas</a>
        </div>
      </div>

      <section className="panel wide">
        <div className="panelHeader">
          <div>
            <h2>Empleados con boletas</h2>
            <p>Resumen basado en boletas_pago_empleado.</p>
          </div>
          <div className="moduleSearch">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadEmployees(query)} placeholder="Buscar empleado" />
            <button className="tableAction" onClick={() => loadEmployees(query)} type="button"><RefreshCcw size={14} /></button>
          </div>
        </div>

        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Pago diario</th>
                <th>Asistencias</th>
                <th>Boletas</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td><strong>{employee.fullName}</strong><small>{employee.position}</small></td>
                  <td>{money(employee.dailyPay)}</td>
                  <td>{employee._count?.attendance ?? 0}</td>
                  <td>{employee._count?.payroll ?? 0}</td>
                  <td><span className={`statusPill ${employee.active ? "active" : "inactive"}`}>{employee.active ? "Activo" : "Inactivo"}</span></td>
                  <td><button className="tableAction" onClick={() => selectEmployee(employee.id)}>Ver boletas</button></td>
                </tr>
              ))}
              {!employees.length && !loading ? <tr><td colSpan={6}>No hay empleados registrados.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel moduleDetail">
        <div className="panelHeader">
          <div>
            <h2>{selected ? `Boletas de ${selected.fullName}` : "Historial de boletas"}</h2>
            <p>{selected ? `${selected.payroll.length} boletas. Total histórico ${money(payrollTotal)}.` : "Selecciona un empleado para ver sus boletas."}</p>
          </div>
        </div>
        <div className="moduleCards">
          {selected?.payroll.map((slip) => (
            <article className="moduleCard" key={slip.id}>
              <span>{slip.slipNumber}</span>
              <strong>{money(slip.netTotal)}</strong>
              <small>{slip.daysWorked} días - {slip.periodMonth}/{slip.periodYear}</small>
            </article>
          ))}
          {selected && !selected.payroll.length ? <p className="moduleEmpty">Este empleado aún no tiene boletas.</p> : null}
        </div>
      </section>

      <button className={`floatingAction ${drawerOpen ? "open" : ""}`} type="button" onClick={drawerOpen ? () => setDrawerOpen(false) : openDrawer} aria-label={drawerOpen ? "Cerrar generador de boletas" : "Abrir generador de boletas"}>
        {drawerOpen ? <X size={24} /> : <Plus size={26} />}
      </button>
      <div className={`sideDrawerBackdrop ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`sideDrawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="sideDrawerHeader">
          <div>
            <p className="eyebrow">Boletas</p>
            <h2>Generar boleta</h2>
          </div>
          <button className="drawerClose" type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form className="adminForm drawerForm" onSubmit={handleSubmit}>
          <label>
            <span>Empleado</span>
            <select value={selected?.id ?? ""} onChange={(event) => selectEmployee(event.target.value)} required>
              {employees.map((employee) => (
                <option value={employee.id} key={employee.id}>{employee.fullName}</option>
              ))}
            </select>
          </label>
          <label><span>Año</span><input type="number" value={form.periodYear} onChange={(event) => setForm((current) => ({ ...current, periodYear: Number(event.target.value) }))} /></label>
          <label><span>Mes</span><input type="number" min={1} max={12} value={form.periodMonth} onChange={(event) => setForm((current) => ({ ...current, periodMonth: Number(event.target.value) }))} /></label>
          <label><span>Descuentos</span><input type="number" min={0} step="0.01" value={form.discounts} onChange={(event) => setForm((current) => ({ ...current, discounts: Number(event.target.value) }))} /></label>
          {message ? <p className="formNote">{message}</p> : null}
          <button className="loginButton" disabled={!selected}><span>Generar boleta</span></button>
        </form>
      </aside>
    </section>
  );
}
