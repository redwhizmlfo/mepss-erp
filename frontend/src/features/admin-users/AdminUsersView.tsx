"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, Save, ShieldCheck, UserCog, XCircle } from "lucide-react";
import {
  AdminUser,
  createUser,
  listRoles,
  listUsers,
  Permission,
  replaceUserPermissions,
  Role,
  updateUserStatus
} from "@/lib/api";

const defaultModules = ["dashboard", "ventas", "inventario", "clientes"];
const permissionModules = [
  "dashboard",
  "ventas",
  "inventario",
  "proveedores",
  "pedidos_proveedor",
  "clientes",
  "empleados",
  "asistencias",
  "salarios",
  "boletas_pago",
  "perdidas",
  "reportes",
  "usuarios",
  "roles",
  "permisos",
  "configuracion",
  "auditoria"
];
const actions: Array<{ key: keyof Omit<Permission, "moduleKey">; label: string }> = [
  { key: "canView", label: "Ver" },
  { key: "canCreate", label: "Crear" },
  { key: "canEdit", label: "Editar" },
  { key: "canDelete", label: "Borrar" }
];

function emptyPermission(moduleKey: string): Permission {
  return {
    moduleKey,
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  };
}

function normalizePermissions(permissions: Permission[]) {
  return permissionModules.map((moduleKey) => permissions.find((permission) => permission.moduleKey === moduleKey) ?? emptyPermission(moduleKey));
}

export function AdminUsersView({ token }: { token: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [permissionDraft, setPermissionDraft] = useState<Permission[]>([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    roleId: ""
  });

  const adminCount = useMemo(() => users.filter((user) => user.role.code === "admin").length, [users]);
  const activeCount = useMemo(() => users.filter((user) => user.active).length, [users]);
  const selectedUser = useMemo(() => users.find((user) => user.id === selectedUserId) ?? users[0], [selectedUserId, users]);
  const selectedEnabledCount = useMemo(
    () =>
      permissionDraft.reduce(
        (total, permission) =>
          total +
          Number(permission.canView) +
          Number(permission.canCreate) +
          Number(permission.canEdit) +
          Number(permission.canDelete),
        0
      ),
    [permissionDraft]
  );

  async function loadData() {
    setLoading(true);
    const [usersResponse, rolesResponse] = await Promise.all([listUsers(token), listRoles(token)]);
    setUsers(usersResponse.data);
    setRoles(rolesResponse);
    const nextSelected = selectedUserId || usersResponse.data[0]?.id || "";
    setSelectedUserId(nextSelected);
    const nextUser = usersResponse.data.find((user) => user.id === nextSelected) ?? usersResponse.data[0];
    setPermissionDraft(nextUser ? normalizePermissions(nextUser.permissions) : normalizePermissions([]));
    setForm((current) => ({
      ...current,
      roleId: current.roleId || rolesResponse.find((role) => role.code === "empleado")?.id || rolesResponse[0]?.id || ""
    }));
    setLoading(false);
  }

  useEffect(() => {
    loadData().catch((error) => {
      setMessage(error instanceof Error ? error.message : "No se pudo cargar usuarios");
      setLoading(false);
    });
  }, [token]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const permissions: Permission[] = defaultModules.map((moduleKey) => ({
      moduleKey,
      canView: true,
      canCreate: moduleKey === "ventas",
      canEdit: false,
      canDelete: false
    }));

    try {
      await createUser(token, {
        username: form.username,
        password: form.password,
        roleId: form.roleId,
        permissions
      });
      setForm((current) => ({ ...current, username: "", password: "" }));
      setMessage("Usuario creado correctamente.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear usuario");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(user: AdminUser) {
    setMessage(null);
    const updated = await updateUserStatus(token, user.id, !user.active);
    setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  function selectUser(userId: string) {
    const user = users.find((item) => item.id === userId);
    setSelectedUserId(userId);
    setPermissionDraft(user ? normalizePermissions(user.permissions) : normalizePermissions([]));
  }

  function togglePermission(moduleKey: string, key: keyof Omit<Permission, "moduleKey">) {
    setPermissionDraft((current) =>
      current.map((permission) =>
        permission.moduleKey === moduleKey
          ? {
              ...permission,
              [key]: !permission[key]
            }
          : permission
      )
    );
  }

  async function handleSavePermissions() {
    if (!selectedUser) return;
    setSavingPermissions(true);
    setMessage(null);
    try {
      const updated = await replaceUserPermissions(token, selectedUser.id, permissionDraft);
      setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
      setPermissionDraft(normalizePermissions(updated.permissions));
      setMessage(`Permisos actualizados para ${updated.username}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron guardar permisos");
    } finally {
      setSavingPermissions(false);
    }
  }

  return (
    <section className="dashboard">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>Usuarios y permisos</h1>
        </div>
        <div className="periodTabs" aria-label="Resumen de usuarios">
          <button className="active">{activeCount} activos</button>
          <button>{adminCount} admin</button>
        </div>
      </div>

      <div className="adminGrid">
        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Crear usuario</h2>
              <p>Alta rapida con permisos iniciales de operacion.</p>
            </div>
            <UserCog size={22} />
          </div>

          <form className="adminForm" onSubmit={handleCreate}>
            <label>
              <span>Usuario</span>
              <input
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="empleado01"
                required
                minLength={3}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="minimo 6 caracteres"
                required
                minLength={6}
              />
            </label>
            <label>
              <span>Rol</span>
              <select
                value={form.roleId}
                onChange={(event) => setForm((current) => ({ ...current, roleId: event.target.value }))}
                required
              >
                {roles.map((role) => (
                  <option value={role.id} key={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            {message ? <p className="formNote">{message}</p> : null}
            <button className="loginButton" type="submit" disabled={saving || loading}>
              <span>{saving ? "Creando..." : "Crear usuario"}</span>
              <Plus size={18} />
            </button>
          </form>
        </section>

        <section className="panel wide">
          <div className="panelHeader">
            <div>
              <h2>Directorio del sistema</h2>
              <p>Usuarios, roles, estado y permisos asignados.</p>
            </div>
            <ShieldCheck size={22} />
          </div>

          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Permisos</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.username}</strong>
                      <small>{user.employee?.fullName ?? "Sin empleado vinculado"}</small>
                    </td>
                    <td>{user.role.name}</td>
                    <td>
                      <div className="permissionChips">
                        {user.permissions.slice(0, 4).map((permission) => (
                          <span key={permission.moduleKey}>{permission.moduleKey}</span>
                        ))}
                        {user.permissions.length > 4 ? <span>+{user.permissions.length - 4}</span> : null}
                      </div>
                    </td>
                    <td>
                      <span className={`statusPill ${user.active ? "active" : "inactive"}`}>
                        {user.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <button className="tableAction" onClick={() => toggleStatus(user)}>
                        {user.active ? "Desactivar" : "Activar"}
                      </button>
                      <button className="tableAction" onClick={() => selectUser(user.id)}>
                        Permisos
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && !loading ? (
                  <tr>
                    <td colSpan={5}>No hay usuarios registrados.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel permissionPanel">
        <div className="panelHeader">
          <div>
            <h2>Editor de permisos</h2>
            <p>
              {selectedUser
                ? `Ajustando accesos de ${selectedUser.username}. ${selectedEnabledCount} checks activos.`
                : "Selecciona un usuario para ajustar accesos."}
            </p>
          </div>
          <button className="loginButton permissionSave" onClick={handleSavePermissions} disabled={!selectedUser || savingPermissions}>
            <span>{savingPermissions ? "Guardando..." : "Guardar permisos"}</span>
            <Save size={18} />
          </button>
        </div>

        <div className="permissionToolbar">
          <label>
            <span>Usuario</span>
            <select value={selectedUser?.id ?? ""} onChange={(event) => selectUser(event.target.value)}>
              {users.map((user) => (
                <option value={user.id} key={user.id}>
                  {user.username} - {user.role.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="permissionMatrix">
          <div className="permissionMatrixHead">
            <span>Modulo</span>
            {actions.map((action) => (
              <span key={action.key}>{action.label}</span>
            ))}
          </div>
          {permissionDraft.map((permission) => (
            <div className="permissionMatrixRow" key={permission.moduleKey}>
              <strong>{permission.moduleKey}</strong>
              {actions.map((action) => (
                <label className="permissionToggle" key={action.key}>
                  <input
                    type="checkbox"
                    checked={permission[action.key]}
                    onChange={() => togglePermission(permission.moduleKey, action.key)}
                  />
                  <span />
                </label>
              ))}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
