"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw, Search, X } from "lucide-react";
import { EmployeeDetail, EmployeeRecord, getEmployee, listEmployees, saveEmployeeAttendance } from "@/lib/api";

const today = new Date().toISOString().slice(0, 10);

export function AttendanceView({ token }: { token: string }) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [selected, setSelected] = useState<EmployeeDetail | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ workDate: today, checkInTime: "08:00", checkOutTime: "18:00", status: "asistio" });
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
      setMessage(error instanceof Error ? error.message : "No se pudo cargar asistencias");
      setLoading(false);
    });
  }, [token]);

  const attendanceSummary = useMemo(() => {
    const rows = selected?.attendance ?? [];
    return {
      total: rows.length,
      attended: rows.filter((item) => item.status === "asistio").length,
      pending: rows.filter((item) => item.status === "pendiente" || item.status === "en_turno").length
    };
  }, [selected]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    await saveEmployeeAttendance(token, selected.id, form);
    setMessage("Asistencia registrada correctamente.");
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
          <p className="eyebrow">Asistencias</p>
          <h1>Control de asistencias</h1>
        </div>
        <div className="moduleTabs" aria-label="Submódulos de empleados">
          <a href="/employees">Empleados</a>
          <a className="active" href="/employees/attendance">Asistencias</a>
          <a href="/employees/payroll">Boletas</a>
        </div>
      </div>

      <section className="panel wide">
        <div className="panelHeader">
          <div>
            <h2>Empleados con asistencia</h2>
            <p>Resumen basado en la tabla asistencias_empleado.</p>
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
                <th>Cargo</th>
                <th>Registros</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td><strong>{employee.fullName}</strong><small>DNI {employee.dni}</small></td>
                  <td>{employee.position}</td>
                  <td>{employee._count?.attendance ?? 0}</td>
                  <td><span className={`statusPill ${employee.active ? "active" : "inactive"}`}>{employee.active ? "Activo" : "Inactivo"}</span></td>
                  <td><button className="tableAction" onClick={() => selectEmployee(employee.id)}>Ver asistencia</button></td>
                </tr>
              ))}
              {!employees.length && !loading ? <tr><td colSpan={5}>No hay empleados registrados.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel moduleDetail">
        <div className="panelHeader">
          <div>
            <h2>{selected ? `Asistencias de ${selected.fullName}` : "Historial de asistencias"}</h2>
            <p>{attendanceSummary.total} registros - {attendanceSummary.attended} asistencias - {attendanceSummary.pending} pendientes/en turno</p>
          </div>
        </div>
        <div className="moduleCards">
          {selected?.attendance.map((item) => (
            <article className="moduleCard" key={item.id}>
              <span>{new Date(item.workDate).toLocaleDateString("es-PE")}</span>
              <strong>{item.status}</strong>
              <small>{item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "--"} / {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "--"}</small>
            </article>
          ))}
          {selected && !selected.attendance.length ? <p className="moduleEmpty">Este empleado aún no tiene asistencias.</p> : null}
        </div>
      </section>

      <button className={`floatingAction ${drawerOpen ? "open" : ""}`} type="button" onClick={drawerOpen ? () => setDrawerOpen(false) : openDrawer} aria-label={drawerOpen ? "Cerrar registro de asistencia" : "Abrir registro de asistencia"}>
        {drawerOpen ? <X size={24} /> : <Plus size={26} />}
      </button>
      <div className={`sideDrawerBackdrop ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`sideDrawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="sideDrawerHeader">
          <div>
            <p className="eyebrow">Asistencia</p>
            <h2>Registrar asistencia</h2>
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
          <label><span>Fecha</span><input type="date" value={form.workDate} onChange={(event) => setForm((current) => ({ ...current, workDate: event.target.value }))} /></label>
          <label><span>Entrada</span><input type="time" value={form.checkInTime} onChange={(event) => setForm((current) => ({ ...current, checkInTime: event.target.value }))} /></label>
          <label><span>Salida</span><input type="time" value={form.checkOutTime} onChange={(event) => setForm((current) => ({ ...current, checkOutTime: event.target.value }))} /></label>
          <label>
            <span>Estado</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
              <option value="asistio">Asistió</option>
              <option value="falto">Faltó</option>
              <option value="en_turno">En turno</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </label>
          {message ? <p className="formNote">{message}</p> : null}
          <button className="loginButton" disabled={!selected}><span>Guardar asistencia</span></button>
        </form>
      </aside>
    </section>
  );
}
