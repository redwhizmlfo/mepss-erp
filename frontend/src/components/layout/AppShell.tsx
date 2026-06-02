"use client";

import React, { useEffect, useState } from "react";
import { Bell, LogOut, Search, Settings, ShieldCheck, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { AuthUser } from "@/lib/api";
import { navItems } from "./nav-items";

type AppShellProps = {
  children: React.ReactNode;
  user: AuthUser;
  onLogout: () => void;
};

export function AppShell({ children, user, onLogout }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("mepss_sidebar_open");
    if (stored) {
      setSidebarOpen(stored === "true");
    }
  }, []);

  function toggleSidebar() {
    setSidebarOpen((current) => {
      const next = !current;
      window.localStorage.setItem("mepss_sidebar_open", String(next));
      return next;
    });
  }

  const allowedModules = new Set(
    user.roleCode === "admin"
      ? navItems.map((item) => item.permission)
      : user.permissions.filter((p) => p.canView).map((p) => p.moduleKey)
  );
  const visibleItems = navItems.filter((item) => allowedModules.has(item.permission));

  return (
    <>
      <main className={`shell${sidebarOpen ? "" : " sidebarCollapsed"}`}>
        <aside className="sidebarNav">
          <div className="navBrand">
            <span className="brandName">MEPSS ERP</span>
            <span className="brandVersion">v2.0</span>
          </div>

          <nav className="navLinks" aria-label="Módulos principales">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path !== "/" && pathname?.startsWith(item.path)) ||
                (item.permission === "ventas" && pathname?.startsWith("/sales"));
              const Icon = item.icon;

              return (
                <div className="navGroup" key={item.label}>
                  <a
                    href={item.path}
                    className={`navItem${isActive ? " active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                    <span>{item.label}</span>
                  </a>

                  {isActive && item.subItems?.length ? (
                    <div className="navSubLinks" aria-label={`Submodulos de ${item.label}`}>
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.path;
                        return (
                          <a
                            className={`navSubItem${isSubActive ? " active" : ""}`}
                            href={subItem.path}
                            key={subItem.path}
                            aria-current={isSubActive ? "page" : undefined}
                          >
                            {subItem.label}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="userBox">
            <div className="userIcon">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <div className="userInfo">
              <span>{user.username}</span>
              <small>Administrador</small>
            </div>
          </div>
        </aside>

        <header className="topNavbar">
          <div className="headerLeft">
            <button
              className={`sidebarToggle${sidebarOpen ? " open" : ""}`}
              type="button"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Ocultar menu lateral" : "Mostrar menu lateral"}
              aria-expanded={sidebarOpen}
            >
              <span />
              <span />
              <span />
            </button>
            <div className="headerTitle">Panel de Control</div>
          </div>

          <div className="searchBar">
            <Search size={16} />
            <input type="text" placeholder="Buscar..." />
          </div>

          <div className="navActionsGroup">
            <button className="navActionBtn" aria-label="Alertas">
              <Bell size={18} strokeWidth={1.5} />
            </button>
            <button className="navActionBtn" aria-label="Ajustes">
              <Settings size={18} strokeWidth={1.5} />
            </button>
            <button className="navActionBtn" aria-label="Usuario">
              <UserCircle size={18} strokeWidth={1.5} />
            </button>
            <button className="navActionBtn" aria-label="Cerrar sesión" onClick={onLogout}>
              <LogOut size={18} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <section className="workspace">{children}</section>
      </main>
    </>
  );
}
