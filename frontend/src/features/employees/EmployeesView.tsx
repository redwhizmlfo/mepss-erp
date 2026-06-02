"use client";

import { FormEvent, useEffect, useState } from "react";
import { BadgePlus, BriefcaseBusiness, CalendarDays, ReceiptText, RefreshCcw, Search } from "lucide-react";
import {
  createEmployee,
  createEmployeePayroll,
  EmployeeDetail,
  EmployeeRecord,
  getEmployee,
  listEmployees,
  saveEmployeeAttendance,
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
  const [attendance, setAttendance] = useState({ workDate: today, checkInTime: "08:00", checkOutTime: "18:00", status: "asistio" });
  const [payroll, setPayroll] = useState({ periodYear: new Date().getFullYear(), periodMonth: new Date().getMonth() + 1, discounts: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
  }

  async function toggleStatus(employee: EmployeeRecord) {
    await updateEmployeeStatus(token, employee.id, !employee.active);
    await loadEmployees(query);
    if (selected?.id === employee.id) {
      await selectEmployee(employee.id);
    }
  }

  async function saveAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    await saveEmployeeAttendance(token, selected.id, attendance);
    setMessage("Asistencia registrada correctamente.");
    await selectEmployee(selected.id);
  }

  async function generatePayroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    await createEmployeePayroll(token, selected.id, payroll);
    setMessage("Boleta generada correctamente.");
    await selectEmployee(selected.id);
  }

  return (
    <section className="dashboard modulePage">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Empleados</p>
          <h1>Empleados, asistencias y boletas</h1>
        </div>
        <div className="periodTabs" aria-label="Resumen de empleados">
          <button className="active">{employees.length} empleados</button>
          <button>{selected?._count?.sales ?? selected?.sales.length ?? 0} ventas</button>
        </div>
      </div>

      <div className="moduleGrid">
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>{editingId ? "Editar empleado" : "Nuevo empleado"}</h2>
              <p>Datos laborales base.</p>
            </div>
            <BadgePlus size={22} />
          </div>

          <form className="adminForm" onSubmit={saveEmployee}>
            <label><span>Nombre completo</span><input value={employeeForm.fullName} onChange={(event) => setEmployeeForm((current) => ({ ...current, fullName: event.target.value }))} required /></label>
            <label><span>DNI</span><input value={employeeForm.dni} onChange={(event) => setEmployeeForm((current) => ({ ...current, dni: event.target.value }))} required /></label>
            <label><span>Cargo</span><input value={employeeForm.position} onChange={(event) => setEmployeeForm((current) => ({ ...current, position: event.target.value }))} required /></label>
            <label><span>Teléfono</span><input value={employeeForm.phone} onChange={(event) => setEmployeeForm((current) => ({ ...current, phone: event.target.value }))} /></label>
            <label><span>Fecha ingreso</span><input type="date" value={employeeForm.hireDate} onChange={(event) => setEmployeeForm((current) => ({ ...current, hireDate: event.target.value }))} required /></label>
            <label><span>Pago diario</span><input type="number" value={employeeForm.dailyPay} onChange={(event) => setEmployeeForm((current) => ({ ...current, dailyPay: Number(event.target.value) }))} min={0} step="0.01" required /></label>
            {message ? <p className="formNote">{message}</p> : null}
            <button className="loginButton" type="submit"><span>{editingId ? "Actualizar empleado" : "Crear empleado"}</span></button>
          </form>
        </section>

        <section className="panel wide">
          <div className="panelHeader">
            <div>
              <h2>Directorio de empleados</h2>
              <p>Usuarios vinculados, ventas, asistencia y boletas.</p>
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
                    <td><strong>{employee.fullName}</strong><small>{employee.position} · DNI {employee.dni}</small></td>
                    <td>{employee.users?.[0]?.username ?? "Sin usuario"}</td>
                    <td>{employee._count?.sales ?? 0}</td>
                    <td>{employee._count?.attendance ?? 0}</td>
                    <td>{employee._count?.payroll ?? 0}</td>
                    <td><span className={`statusPill ${employee.active ? "active" : "inactive"}`}>{employee.active ? "Activo" : "Inactivo"}</span></td>
                    <td>
                      <button className="tableAction" onClick={() => selectEmployee(employee.id)}>Ver</button>
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
      </div>

      <div className="moduleSplit">
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Asistencias</h2>
              <p>{selected ? selected.fullName : "Selecciona un empleado."}</p>
            </div>
            <CalendarDays size={22} />
          </div>
          <form className="adminForm compactForm" onSubmit={saveAttendance}>
            <label><span>Fecha</span><input type="date" value={attendance.workDate} onChange={(event) => setAttendance((current) => ({ ...current, workDate: event.target.value }))} /></label>
            <label><span>Entrada</span><input type="time" value={attendance.checkInTime} onChange={(event) => setAttendance((current) => ({ ...current, checkInTime: event.target.value }))} /></label>
            <label><span>Salida</span><input type="time" value={attendance.checkOutTime} onChange={(event) => setAttendance((current) => ({ ...current, checkOutTime: event.target.value }))} /></label>
            <label><span>Estado</span><select value={attendance.status} onChange={(event) => setAttendance((current) => ({ ...current, status: event.target.value }))}><option value="asistio">Asistió</option><option value="falto">Faltó</option><option value="en_turno">En turno</option><option value="pendiente">Pendiente</option></select></label>
            <button className="loginButton" disabled={!selected}><span>Registrar asistencia</span></button>
          </form>
          <div className="moduleCards">
            {selected?.attendance.map((item) => (
              <article className="moduleCard" key={item.id}>
                <span>{new Date(item.workDate).toLocaleDateString("es-PE")}</span>
                <strong>{item.status}</strong>
                <small>{item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "--"} / {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "--"}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Boletas de pago</h2>
              <p>Generadas desde asistencias del periodo.</p>
            </div>
            <ReceiptText size={22} />
          </div>
          <form className="adminForm compactForm" onSubmit={generatePayroll}>
            <label><span>Año</span><input type="number" value={payroll.periodYear} onChange={(event) => setPayroll((current) => ({ ...current, periodYear: Number(event.target.value) }))} /></label>
            <label><span>Mes</span><input type="number" min={1} max={12} value={payroll.periodMonth} onChange={(event) => setPayroll((current) => ({ ...current, periodMonth: Number(event.target.value) }))} /></label>
            <label><span>Descuentos</span><input type="number" min={0} step="0.01" value={payroll.discounts} onChange={(event) => setPayroll((current) => ({ ...current, discounts: Number(event.target.value) }))} /></label>
            <button className="loginButton" disabled={!selected}><span>Generar boleta</span></button>
          </form>
          <div className="moduleCards">
            {selected?.payroll.map((slip) => (
              <article className="moduleCard" key={slip.id}>
                <span>{slip.slipNumber}</span>
                <strong>{money(slip.netTotal)}</strong>
                <small>{slip.daysWorked} días · {slip.periodMonth}/{slip.periodYear}</small>
              </article>
            ))}
          </div>
        </section>
      </div>

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
              <small>{sale.client?.name ?? "Sin cliente"} · {new Date(sale.createdAt).toLocaleDateString("es-PE")}</small>
            </article>
          ))}
          {selected && !selected.sales.length ? <p className="moduleEmpty">Este empleado aún no registra ventas.</p> : null}
        </div>
      </section>
    </section>
  );
}
