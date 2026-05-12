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

export type Role = {
  id: string;
  code: string;
  name: string;
};

export type AdminUser = {
  id: string;
  username: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastAccessAt: string | null;
  role: Role;
  employee: AuthUser["employee"];
  permissions: Permission[];
};

export type PaginatedUsers = {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
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

export function listUsers(token: string) {
  return request<PaginatedUsers>("/users?pageSize=50", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function listRoles(token: string) {
  return request<Role[]>("/users/roles", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function createUser(
  token: string,
  payload: {
    username: string;
    password: string;
    roleId: string;
    permissions: Permission[];
  }
) {
  return request<AdminUser>("/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}

export function updateUserStatus(token: string, userId: string, active: boolean) {
  return request<AdminUser>(`/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ active })
  });
}

export function replaceUserPermissions(token: string, userId: string, permissions: Permission[]) {
  return request<AdminUser>(`/users/${userId}/permissions`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ permissions })
  });
}
