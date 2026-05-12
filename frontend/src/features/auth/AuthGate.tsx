"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthUser, getMe, login } from "@/lib/api";
import { LoginView } from "./LoginView";

const TOKEN_KEY = "luxury_ops_token";

type AuthGateProps = {
  children: (session: { token: string; user: AuthUser }) => ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    getMe(storedToken)
      .then(setUser)
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const canEnter = useMemo(() => Boolean(token && user), [token, user]);

  async function handleLogin(username: string, password: string) {
    setError(null);
    const session = await login(username, password);
    window.localStorage.setItem(TOKEN_KEY, session.accessToken);
    setToken(session.accessToken);
    setUser(session.user);
  }

  function handleLogout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  if (loading) {
    return (
      <main className="authCanvas">
        <div className="loginCard compact">
          <span className="brandMark">LO</span>
          <p>Preparando sesion...</p>
        </div>
      </main>
    );
  }

  if (!canEnter) {
    return (
      <LoginView
        error={error}
        onSubmit={async (username, password) => {
          try {
            await handleLogin(username, password);
          } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesion");
          }
        }}
      />
    );
  }

  return (
    <AppShell user={user!} onLogout={handleLogout}>
      {children({ token: token!, user: user! })}
    </AppShell>
  );
}
