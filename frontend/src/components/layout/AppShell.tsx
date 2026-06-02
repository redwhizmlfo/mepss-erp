"use client";

import React, { useEffect, useState } from "react";
import { Bell, ChevronDown, LogOut, Search, Settings, ShieldCheck, UserCircle } from "lucide-react";
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem("mepss_sidebar_open");
    if (stored) {
      setSidebarOpen(stored === "true");
    }

    const storedGroups = window.localStorage.getItem("mepss_sidebar_groups");
    if (storedGroups) {
      try {
        setOpenGroups(JSON.parse(storedGroups) as Record<string, boolean>);
      } catch {
        window.localStorage.removeItem("mepss_sidebar_groups");
      }
    }
  }, []);

  function toggleSidebar() {
    setSidebarOpen((current) => {
      const next = !current;
      window.localStorage.setItem("mepss_sidebar_open", String(next));
      return next;
    });
  }

  function toggleGroup(key: string) {
    setOpenGroups((current) => {
      const next = { ...current, [key]: !current[key] };
      window.localStorage.setItem("mepss_sidebar_groups", JSON.stringify(next));
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
              const subItems = item.subItems ?? [];
              const hasSubItems = subItems.length > 0;
              const isGroupOpen = hasSubItems && (openGroups[item.permission] ?? isActive);
              const Icon = item.icon;

              return (
                <div className="navGroup" key={item.label}>
                  <div className={`navItemRow${isActive ? " active" : ""}`}>
                    {hasSubItems ? (
                      <button
                        className="navItem navItemButton"
                        type="button"
                        onClick={() => toggleGroup(item.permission)}
                        aria-current={isActive ? "page" : undefined}
                        aria-expanded={isGroupOpen}
                      >
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <a
                        href={item.path}
                        className="navItem"
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                        <span>{item.label}</span>
                      </a>
                    )}

                    {hasSubItems ? (
                      <button
                        className={`navAccordionBtn${isGroupOpen ? " open" : ""}`}
                        type="button"
                        onClick={() => toggleGroup(item.permission)}
                        aria-label={isGroupOpen ? `Ocultar submodulos de ${item.label}` : `Mostrar submodulos de ${item.label}`}
                        aria-expanded={isGroupOpen}
                      >
                        <ChevronDown size={16} />
                      </button>
                    ) : null}
                  </div>

                  {hasSubItems ? (
                    <div className={`navSubLinks${isGroupOpen ? " open" : ""}`} aria-label={`Submodulos de ${item.label}`}>
                      {subItems.map((subItem) => {
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
