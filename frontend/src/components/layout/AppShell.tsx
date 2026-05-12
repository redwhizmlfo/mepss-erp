"use client";

import { Bell, Command, LogOut, Search } from "lucide-react";
import { AuthUser } from "@/lib/api";
import { navItems } from "./nav-items";

type AppShellProps = {
  children: React.ReactNode;
  user: AuthUser;
  onLogout: () => void;
};

export function AppShell({ children, user, onLogout }: AppShellProps) {
  const allowedModules = new Set(
    user.roleCode === "admin"
      ? navItems.map((item) => item.permission)
      : user.permissions.filter((permission) => permission.canView).map((permission) => permission.moduleKey)
  );
  const visibleItems = navItems.filter((item) => allowedModules.has(item.permission));

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brandMark">LO</span>
          <div>
            <strong>Luxury Ops</strong>
            <small>Command suite</small>
          </div>
        </div>

        <nav className="navList" aria-label="Modulos principales">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <a href={item.path} className="navItem" key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="commandBox">
            <Search size={17} />
            <span>Buscar modulo, venta, producto o empleado</span>
            <kbd><Command size={13} />K</kbd>
          </div>
          <div className="topbarActions">
            <button className="iconButton" aria-label="Alertas">
              <Bell size={18} />
            </button>
            <div className="userPill">
              <span>{user.username}</span>
              <small>{user.roleName}</small>
            </div>
            <button className="iconButton" aria-label="Cerrar sesion" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
