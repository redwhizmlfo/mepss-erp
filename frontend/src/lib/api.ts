export type Permission = {
  moduleKey: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export type AuthUser = {
  id: string;
  username: string;
  roleCode: string;
  roleName: string;
  employee: {
    id: string;
    fullName: string;
    position: string;
  } | null;
  permissions: Permission[];
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de conexion" }));
    throw new Error(error.message ?? "Error de API");
  }

  return response.json() as Promise<T>;
}

export function login(username: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export function getMe(token: string) {
  return request<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
