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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://mepss-erp-api.onrender.com/api/v1"
    : "http://localhost:4000/api/v1");

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

// ─── POS / VENTAS TYPES ───────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  modelCode?: string | null;
  specs?: string | null;
  unitName: string;
  stock: number;
  reservedQty: number;
  minStock: number;
  salePrice: number;
  costPrice: number;
  iconCode: string | null;
  imageUrl?: string | null;
  description: string | null;
  active: boolean;
  category: Category;
};

export type Customer = {
  id: string;
  documentType: string;
  documentNumber: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
};

export type PaymentMethod = {
  id: string;
  code: string;
  name: string;
  active: boolean;
};

export type VoucherType = {
  id: string;
  code: string;
  name: string;
  seriesPrefix: string | null;
  active: boolean;
};

export type CreateSalePayload = {
  clientId?: string | null;
  paymentMethodId: string;
  voucherTypeId: string;
  discountPct?: number;
  amountReceived: number;
  note?: string;
  items: { productId: string; quantity: number }[];
};

export type SaleResult = {
  id: string;
  serie: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  amountReceived: number;
  changeAmount: number;
  voucherType: VoucherType;
  paymentMethod: PaymentMethod;
  client: Customer | null;
};

export type CustomerRecord = Customer & {
  _count?: { sales: number };
  sales?: Array<{ id: string; serie: string; total: number; createdAt: string }>;
};

export type CustomerDetail = Customer & {
  sales: Array<SaleResult & {
    createdAt: string;
    employee: { id: string; fullName: string; position: string };
    details: Array<{ id: string; productNameSnapshot: string; quantity: number; lineTotal: number }>;
  }>;
};

export type EmployeeRecord = {
  id: string;
  fullName: string;
  dni: string;
  position: string;
  phone: string | null;
  hireDate: string;
  dailyPay: number;
  active: boolean;
  users?: Array<{ id: string; username: string; active: boolean; role: Role }>;
  _count?: { sales: number; attendance: number; payroll: number };
};

export type EmployeeDetail = EmployeeRecord & {
  sales: Array<SaleResult & {
    createdAt: string;
    client: Customer | null;
  }>;
  attendance: Array<{
    id: string;
    workDate: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: string;
    source: string;
  }>;
  payroll: Array<{
    id: string;
    slipNumber: string;
    periodYear: number;
    periodMonth: number;
    daysWorked: number;
    dailyPay: number;
    subtotal: number;
    discounts: number;
    netTotal: number;
  }>;
};

// ─── POS / VENTAS API FUNCTIONS ───────────────────────────────────────────

export async function listProducts(token: string, categoryId?: string, query?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (categoryId) params.append("categoryId", categoryId);
  if (query) params.append("q", query);

  const res = await fetch(`${API_URL}/inventory/products?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error loading products");
  return res.json();
}

export async function listCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${API_URL}/inventory/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error loading categories");
  return res.json();
}

export async function createProduct(token: string, data: any): Promise<Product> {
  const res = await fetch(`${API_URL}/inventory/products`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export function listPaymentMethods(token: string) {
  return request<PaymentMethod[]>("/sales/payment-methods", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function listVoucherTypes(token: string) {
  return request<VoucherType[]>("/sales/voucher-types", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function searchCustomers(token: string, query?: string) {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<Customer[]>(`/sales/customers${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function createSale(token: string, payload: CreateSalePayload) {
  return request<SaleResult>("/sales", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function listCustomers(token: string, query?: string) {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<CustomerRecord[]>(`/customers${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getCustomer(token: string, customerId: string) {
  return request<CustomerDetail>(`/customers/${customerId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function createCustomer(token: string, payload: Partial<Customer>) {
  return request<CustomerRecord>("/customers", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function updateCustomer(token: string, customerId: string, payload: Partial<Customer>) {
  return request<CustomerRecord>(`/customers/${customerId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function updateCustomerStatus(token: string, customerId: string, active: boolean) {
  return request<CustomerRecord>(`/customers/${customerId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ active })
  });
}

export function listEmployees(token: string, query?: string) {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<EmployeeRecord[]>(`/employees${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function getEmployee(token: string, employeeId: string) {
  return request<EmployeeDetail>(`/employees/${employeeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function createEmployee(token: string, payload: Partial<EmployeeRecord>) {
  return request<EmployeeRecord>("/employees", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function updateEmployee(token: string, employeeId: string, payload: Partial<EmployeeRecord>) {
  return request<EmployeeRecord>(`/employees/${employeeId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function updateEmployeeStatus(token: string, employeeId: string, active: boolean) {
  return request<EmployeeRecord>(`/employees/${employeeId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ active })
  });
}

export function saveEmployeeAttendance(
  token: string,
  employeeId: string,
  payload: { workDate: string; checkInTime?: string; checkOutTime?: string; status: string }
) {
  return request(`/employees/${employeeId}/attendance`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export function createEmployeePayroll(
  token: string,
  employeeId: string,
  payload: { periodYear: number; periodMonth: number; discounts: number }
) {
  return request(`/employees/${employeeId}/payroll`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}
