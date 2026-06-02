# Reporte de test de peticiones y respuestas

Fecha: 2026-06-02

Ambiente probado:

```txt
Frontend: https://mepss-erp-frontend.vercel.app
Backend: https://mepss-erp-api.onrender.com/api/v1
Base de datos: Neon PostgreSQL
Usuario: admin
```

## Flujo de ingreso

| Petición | Método | Resultado esperado |
|---|---:|---|
| `/health` | GET | `200`, servicio activo |
| `/auth/login` | POST | `200`, devuelve `accessToken` y usuario |
| `/auth/me` | GET | `200`, devuelve usuario actual, rol y permisos |

## Módulos y listados

| Módulo | Petición | Método | Resultado esperado |
|---|---|---:|---|
| Usuarios | `/users/roles` | GET | Lista de roles |
| Usuarios | `/users?pageSize=50` | GET | Lista paginada de usuarios |
| Inventario | `/inventory/products` | GET | Lista de productos |
| Inventario | `/inventory/categories` | GET | Lista de categorías |
| Ventas | `/sales/payment-methods` | GET | Lista de métodos de pago |
| Ventas | `/sales/voucher-types` | GET | Lista de comprobantes |
| Ventas | `/sales/customers` | GET | Buscador de clientes para POS |
| Clientes | `/customers` | GET | Lista de clientes con resumen de ventas |
| Empleados | `/employees` | GET | Lista de empleados con usuarios, ventas, asistencias y boletas |
| Dashboard | `/reports/dashboard` | GET | Resumen ejecutivo |
| Dashboard | `/reports/dashboard/executive` | GET | Resumen ejecutivo |

## Páginas frontend

| Página | Resultado esperado |
|---|---|
| `/` | Carga login/dashboard |
| `/customers` | Carga módulo Clientes |
| `/employees` | Carga módulo Empleados |
| `/employees/attendance` | Carga submódulo Asistencias |
| `/employees/payroll` | Carga submódulo Boletas |
| `/inventory/products` | Carga módulo Inventario |
| `/sales/pos` | Carga POS de ventas |
| `/admin/users` | Carga administración de usuarios |

## Observación

El endpoint base de dashboard fue normalizado para que responda tanto:

```txt
/api/v1/reports/dashboard
/api/v1/reports/dashboard/executive
```

En Render Free, la primera petición puede demorar si el servicio estuvo dormido.
