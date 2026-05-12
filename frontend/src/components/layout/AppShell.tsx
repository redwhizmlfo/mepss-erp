import { Bell, Command, LogOut, Search } from "lucide-react";
import { navItems } from "./nav-items";

export function AppShell({ children }: { children: React.ReactNode }) {
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
          {navItems.map((item) => {
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
              <span>Admin</span>
              <small>Administrador</small>
            </div>
            <button className="iconButton" aria-label="Cerrar sesion">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
