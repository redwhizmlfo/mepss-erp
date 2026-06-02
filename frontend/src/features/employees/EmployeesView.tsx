"use client";

import { FormEvent, useEffect, useState } from "react";
import { BriefcaseBusiness, Plus, RefreshCcw, Search, X } from "lucide-react";
import {
  createEmployee,
  EmployeeDetail,
  EmployeeRecord,
  getEmployee,
  listEmployees,
  updateEmployee,
  updateEmployeeStatus
} from "@/lib/api";

const today = new Date().toISOString().slice(0, 10);
const emptyEmployee = {
  fullName: "",
  dni: "",
  position: "",
  phone: "",
  hireDate: today,
  dailyPay: 0
};

function money(value: number | string) {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function EmployeesView({ token }: { token: string }) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [selected, setSelected] = useState<EmployeeDetail | null>(null);
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
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
      setMessage(error instanceof Error ? error.message : "No se pudo cargar empleados");
      setLoading(false);
    });
  }, [token]);

  function openNewEmployee() {
    setEditingId(null);
    setEmployeeForm(emptyEmployee);
    setMessage(null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingId(null);
    setEmployeeForm(emptyEmployee);
  }

  async function saveEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    try {
      if (editingId) {
        await updateEmployee(token, editingId, employeeForm);
        setMessage("Empleado actualizado correctamente.");
      } else {
        await createEmployee(token, employeeForm);
        setMessage("Empleado creado correctamente.");
      }
      setEmployeeForm(emptyEmployee);
      setEditingId(null);
      setDrawerOpen(false);
      setSelected(null);
      await loadEmployees("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar empleado");
    }
  }

  function editEmployee(employee: EmployeeRecord) {
    setEditingId(employee.id);
    setEmployeeForm({
      fullName: employee.fullName,
      dni: employee.dni,
      position: employee.position,
      phone: employee.phone ?? "",
      hireDate: employee.hireDate.slice(0, 10),
      dailyPay: Number(employee.dailyPay)
    });
    setMessage(null);
    setDrawerOpen(true);
  }

  async function toggleStatus(employee: EmployeeRecord) {
    await updateEmployeeStatus(token, employee.id, !employee.active);
    await loadEmployees(query);
    if (selected?.id === employee.id) {
      await selectEmployee(employee.id);
    }
  }

  return (
    <section className="dashboard modulePage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Empleados</p>
          <h1>Directorio de empleados</h1>
        </div>
        <div className="moduleTabs" aria-label="Submódulos de empleados">
          <a className="active" href="/employees">Empleados</a>
          <a href="/employees/attendance">Asistencias</a>
          <a href="/employees/payroll">Boletas</a>
        </div>
      </div>

      <section className="panel wide">
        <div className="panelHeader">
          <div>
            <h2>Empleados registrados</h2>
            <p>Datos laborales, usuario vinculado y actividad comercial.</p>
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
                <th>Usuario</th>
                <th>Ventas</th>
                <th>Asistencias</th>
                <th>Boletas</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td><strong>{employee.fullName}</strong><small>{employee.position} - DNI {employee.dni}</small></td>
                  <td>{employee.users?.[0]?.username ?? "Sin usuario"}</td>
                  <td>{employee._count?.sales ?? 0}</td>
                  <td>{employee._count?.attendance ?? 0}</td>
                  <td>{employee._count?.payroll ?? 0}</td>
                  <td><span className={`statusPill ${employee.active ? "active" : "inactive"}`}>{employee.active ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <button className="tableAction" onClick={() => selectEmployee(employee.id)}>Ventas</button>
                    <button className="tableAction" onClick={() => editEmployee(employee)}>Editar</button>
                    <button className="tableAction" onClick={() => toggleStatus(employee)}>{employee.active ? "Desactivar" : "Activar"}</button>
                  </td>
                </tr>
              ))}
              {!employees.length && !loading ? <tr><td colSpan={7}>No hay empleados registrados.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel moduleDetail">
        <div className="panelHeader">
          <div>
            <h2>Ventas atendidas</h2>
            <p>{selected ? `${selected.sales.length} últimas ventas de ${selected.fullName}.` : "Selecciona un empleado para ver ventas."}</p>
          </div>
          <BriefcaseBusiness size={22} />
        </div>
        <div className="moduleCards">
          {selected?.sales.map((sale) => (
            <article className="moduleCard" key={sale.id}>
              <span>{sale.serie}</span>
              <strong>{money(sale.total)}</strong>
              <small>{sale.client?.name ?? "Sin cliente"} - {new Date(sale.createdAt).toLocaleDateString("es-PE")}</small>
            </article>
          ))}
          {selected && !selected.sales.length ? <p className="moduleEmpty">Este empleado aún no registra ventas.</p> : null}
        </div>
      </section>

      <button className={`floatingAction ${drawerOpen ? "open" : ""}`} type="button" onClick={drawerOpen ? closeDrawer : openNewEmployee} aria-label={drawerOpen ? "Cerrar registro de empleado" : "Abrir registro de empleado"}>
        {drawerOpen ? <X size={24} /> : <Plus size={26} />}
      </button>
      <div className={`sideDrawerBackdrop ${drawerOpen ? "open" : ""}`} onClick={closeDrawer} />
      <aside className={`sideDrawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="sideDrawerHeader">
          <div>
            <p className="eyebrow">Registro</p>
            <h2>{editingId ? "Editar empleado" : "Nuevo empleado"}</h2>
          </div>
          <button className="drawerClose" type="button" onClick={closeDrawer} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form className="adminForm drawerForm" onSubmit={saveEmployee}>
          <label>
            <span>Nombre completo</span>
            <input value={employeeForm.fullName} onChange={(event) => setEmployeeForm((current) => ({ ...current, fullName: event.target.value }))} required />
          </label>
          <label>
            <span>DNI</span>
            <input value={employeeForm.dni} onChange={(event) => setEmployeeForm((current) => ({ ...current, dni: event.target.value }))} required />
          </label>
          <label>
            <span>Cargo</span>
            <input value={employeeForm.position} onChange={(event) => setEmployeeForm((current) => ({ ...current, position: event.target.value }))} required />
          </label>
          <label>
            <span>Teléfono</span>
            <input value={employeeForm.phone} onChange={(event) => setEmployeeForm((current) => ({ ...current, phone: event.target.value }))} />
          </label>
          <label>
            <span>Fecha ingreso</span>
            <input type="date" value={employeeForm.hireDate} onChange={(event) => setEmployeeForm((current) => ({ ...current, hireDate: event.target.value }))} required />
          </label>
          <label>
            <span>Pago diario</span>
            <input type="number" value={employeeForm.dailyPay} onChange={(event) => setEmployeeForm((current) => ({ ...current, dailyPay: Number(event.target.value) }))} min={0} step="0.01" required />
          </label>
          {message ? <p className="formNote">{message}</p> : null}
          <button className="loginButton" type="submit">
            <span>{editingId ? "Actualizar empleado" : "Crear empleado"}</span>
          </button>
        </form>
      </aside>
    </section>
  );
}
