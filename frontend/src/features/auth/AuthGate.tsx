"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthUser, getMe, login } from "@/lib/api";
import { LoginView } from "./LoginView";

const TOKEN_KEY = "luxury_ops_token";
const USER_KEY = "luxury_ops_user";
const SESSION_EXPIRED_MESSAGE = "La sesion expiro. Ingresa de nuevo.";

type AuthGateProps = {
  children: (session: { token: string; user: AuthUser }) => ReactNode;
};

function clearStoredSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

function getTokenExpiresAt(token: string) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const decodedPayload = window.atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as { exp?: number };

    return typeof parsedPayload.exp === "number" ? parsedPayload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function readStoredSession() {
  const storedToken = window.localStorage.getItem(TOKEN_KEY);
  const storedUser = window.localStorage.getItem(USER_KEY);

  if (!storedToken || !storedUser) {
    return { token: storedToken, user: null };
  }

  const expiresAt = getTokenExpiresAt(storedToken);

  if (!expiresAt || expiresAt <= Date.now()) {
    clearStoredSession();
    return { token: null, user: null };
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser) as AuthUser
    };
  } catch {
    clearStoredSession();
    return { token: storedToken, user: null };
  }
}

export function AuthGate({ children }: AuthGateProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (!storedSession.token) {
      setLoading(false);
      return;
    }

    setToken(storedSession.token);
    setUser(storedSession.user);

    getMe(storedSession.token)
      .then((freshUser) => {
        setUser(freshUser);
        window.localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {
        clearStoredSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const expiresAt = getTokenExpiresAt(token);

    if (!expiresAt) {
      clearStoredSession();
      setToken(null);
      setUser(null);
      setError(SESSION_EXPIRED_MESSAGE);
      return;
    }

    const timeLeft = expiresAt - Date.now();

    if (timeLeft <= 0) {
      clearStoredSession();
      setToken(null);
      setUser(null);
      setError(SESSION_EXPIRED_MESSAGE);
      return;
    }

    const logoutTimer = window.setTimeout(() => {
      clearStoredSession();
      setToken(null);
      setUser(null);
      setError(SESSION_EXPIRED_MESSAGE);
    }, timeLeft);

    return () => window.clearTimeout(logoutTimer);
  }, [token]);

  const canEnter = useMemo(() => Boolean(token && user), [token, user]);

  async function handleLogin(username: string, password: string) {
    setError(null);
    const session = await login(username.trim(), password);
    const expiresAt = getTokenExpiresAt(session.accessToken);

    if (!expiresAt || expiresAt <= Date.now()) {
      throw new Error("No se pudo crear una sesion valida");
    }

    window.localStorage.setItem(TOKEN_KEY, session.accessToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    setToken(session.accessToken);
    setUser(session.user);
  }

  function handleLogout() {
    clearStoredSession();
    setToken(null);
    setUser(null);
    setError(null);
  }

  if (loading) {
    return (
      <main className="authCanvas">
        <div className="loginCard compact">
          <span className="brandMark">MEPSS</span>
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
