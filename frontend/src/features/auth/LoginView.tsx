"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";

type LoginViewProps = {
  error: string | null;
  onSubmit: (username: string, password: string) => Promise<void>;
};

export function LoginView({ error, onSubmit }: LoginViewProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(username, password);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="authCanvas">
      <section className="loginCard">
        <div className="loginBrand">
          <span className="brandMark">MEPSS</span>
          <div>
            <p className="eyebrow">MEPSS ERP</p>
            <h1>Acceso operativo</h1>
          </div>
        </div>

        <p className="loginCopy">
          Ingresa al centro de mando para ventas, inventario, proveedores, empleados y reportes.
        </p>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            <span>Usuario</span>
            <div className="fieldShell">
              <UserRound size={18} />
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            </div>
          </label>

          <label>
            <span>Contraseña</span>
            <div className="fieldShell">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
          </label>

          {error ? <p className="formError">{error}</p> : null}

          <button className="loginButton" type="submit" disabled={submitting}>
            <span>{submitting ? "Validando..." : "Entrar al sistema"}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </section>

      <aside className="authAside">
        <div className="authImageWrap" aria-hidden="true">
          <img src="/fere.png" alt="" />
        </div>
      </aside>
    </main>
  );
}
