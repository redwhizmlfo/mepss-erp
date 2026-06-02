"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthUser, getMe, login } from "@/lib/api";
import { LoginView } from "./LoginView";

const TOKEN_KEY = "luxury_ops_token";
const USER_KEY = "luxury_ops_user";

type AuthGateProps = {
  children: (session: { token: string; user: AuthUser }) => ReactNode;
};

function readStoredSession() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const storedToken = window.localStorage.getItem(TOKEN_KEY);
  const storedUser = window.localStorage.getItem(USER_KEY);

  if (!storedToken || !storedUser) {
    return { token: storedToken, user: null };
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser) as AuthUser
    };
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return { token: storedToken, user: null };
  }
}

export function AuthGate({ children }: AuthGateProps) {
  const [initialSession] = useState(readStoredSession);
  const [token, setToken] = useState<string | null>(initialSession.token);
  const [user, setUser] = useState<AuthUser | null>(initialSession.user);
  const [loading, setLoading] = useState(!initialSession.token || !initialSession.user);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    setLoading((current) => (user ? false : current));

    getMe(storedToken)
      .then((freshUser) => {
        setUser(freshUser);
        window.localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const canEnter = useMemo(() => Boolean(token && user), [token, user]);

  async function handleLogin(username: string, password: string) {
    setError(null);
    const session = await login(username, password);
    window.localStorage.setItem(TOKEN_KEY, session.accessToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    setToken(session.accessToken);
    setUser(session.user);
  }

  function handleLogout() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  if (loading) {
    return (
      <main className="authCanvas">
        <div className="loginCard compact">
          <span className="brandMark">MEPSS</span>
          <p>Preparando sesión...</p>
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
            setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión");
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
