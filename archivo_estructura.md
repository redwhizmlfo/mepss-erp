# Estructura del proyecto

La estructura utilizada como referencia corresponde a las carpetas y archivos identificados en la rama principal del repositorio.

No se incluyen carpetas generadas o dependencias locales como `node_modules`, `.next`, `dist`, `out` ni archivos de entorno con secretos.

```txt
.
|-- .github/
|   |-- ISSUE_TEMPLATE/
|   |   +-- actividad.md
|   +-- workflows/
|       |-- ci-cd.yml
|       +-- github-pages.yml
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
|   |   |   |-- 0001_init/
|   |   |   |   +-- migration.sql
|   |   |   |-- 0002_supplier_orders/
|   |   |   |   +-- migration.sql
|   |   |   |-- 20260529125054_sync_schema/
|   |   |   |   +-- migration.sql
|   |   |   |-- 20260529131551_add_product_image/
|   |   |   |   +-- migration.sql
|   |   |   +-- migration_lock.toml
|   |   |-- inserts_empleados_reales.sql
|   |   +-- schema.prisma
|   |-- src/
|   |   |-- config/
|   |   |   +-- env.ts
|   |   |-- modules/
|   |   |   |-- auth/
|   |   |   |   |-- auth.routes.ts
|   |   |   |   |-- auth.schemas.ts
|   |   |   |   +-- auth.service.ts
|   |   |   |-- customers/
|   |   |   |   +-- customers.routes.ts
|   |   |   |-- employees/
|   |   |   |   +-- employees.routes.ts
|   |   |   |-- inventory/
|   |   |   |   +-- inventory.routes.ts
|   |   |   |-- reports/
|   |   |   |   |-- dashboard.routes.ts
|   |   |   |   +-- dashboard.service.ts
|   |   |   |-- sales/
|   |   |   |   +-- sales.routes.ts
|   |   |   +-- users/
|   |   |       |-- users.controller.ts
|   |   |       |-- users.repository.ts
|   |   |       |-- users.routes.ts
|   |   |       |-- users.schemas.ts
|   |   |       +-- users.service.ts
|   |   |-- shared/
|   |   |   |-- async-handler.ts
|   |   |   |-- auth-middleware.ts
|   |   |   |-- http-error.ts
|   |   |   +-- prisma.ts
|   |   |-- app.ts
|   |   |-- seed.ts
|   |   +-- server.ts
|   |-- .env.example
|   |-- .env.production.example
|   |-- package.json
|   +-- tsconfig.json
|-- docs/
|   |-- BASE_DATOS_Y_PROMPT_PROYECTO.md
|   |-- ENTREGABLES_ARQUITECTURA_NUBE.md
|   |-- GITHUB_ISSUES_KANBAN.md
|   |-- GUIA_DESPLIEGUE_NUBE.md
|   |-- IMPLEMENTACION_PROYECTO.md
|   |-- PROTOCOLO_SINCRONIZACION_GITHUB.md
|   |-- REFERENCIAS_VISUALES_GITHUB.md
|   |-- REPORTE_TEST_PETICIONES.md
|   +-- STACK_TECNICO_NEXT_NODE_PRISMA.md
|-- frontend/
|   |-- public/
|   |   +-- fere.png
|   |-- src/
|   |   |-- app/
|   |   |   |-- admin/users/
|   |   |   |   |-- AdminUsersClient.tsx
|   |   |   |   +-- page.tsx
|   |   |   |-- customers/
|   |   |   |   +-- page.tsx
|   |   |   |-- employees/
|   |   |   |   |-- attendance/page.tsx
|   |   |   |   |-- payroll/page.tsx
|   |   |   |   +-- page.tsx
|   |   |   |-- inventory/products/
|   |   |   |   |-- InventoryClient.tsx
|   |   |   |   |-- ProductFormModal.tsx
|   |   |   |   +-- page.tsx
|   |   |   |-- sales/
|   |   |   |   |-- history/
|   |   |   |   |   |-- SalesHistoryClient.tsx
|   |   |   |   |   +-- page.tsx
|   |   |   |   |-- pos/
|   |   |   |   |   |-- SalesPosClient.tsx
|   |   |   |   |   |-- SalesPosFull.tsx
|   |   |   |   |   +-- page.tsx
|   |   |   |   +-- page.tsx
|   |   |   |-- HomeClient.tsx
|   |   |   |-- globals.css
|   |   |   |-- layout.tsx
|   |   |   +-- page.tsx
|   |   |-- components/layout/
|   |   |   |-- AppShell.tsx
|   |   |   +-- nav-items.ts
|   |   |-- features/
|   |   |   |-- admin-users/AdminUsersView.tsx
|   |   |   |-- auth/
|   |   |   |   |-- AuthGate.tsx
|   |   |   |   +-- LoginView.tsx
|   |   |   |-- customers/CustomersView.tsx
|   |   |   |-- dashboard/DashboardView.tsx
|   |   |   |-- employees/
|   |   |   |   |-- AttendanceView.tsx
|   |   |   |   |-- EmployeesView.tsx
|   |   |   |   +-- PayrollView.tsx
|   |   |   +-- sales/
|   |   |       |-- SalesHistoryView.tsx
|   |   |       +-- SalesPosView.tsx
|   |   |-- lib/
|   |   |   +-- api.ts
|   |   +-- styles/
|   |       |-- admin.css
|   |       |-- auth.css
|   |       |-- dashboard.css
|   |       |-- form.css
|   |       |-- inventory.css
|   |       |-- layout.css
|   |       |-- modules.css
|   |       |-- sales.css
|   |       +-- tokens.css
|   |-- .env.example
|   |-- .env.production.example
|   |-- next-env.d.ts
|   |-- next.config.ts
|   |-- package.json
|   +-- tsconfig.json
|-- .gitignore
|-- README.md
|-- code.html
|-- docker-compose.yml
|-- fake_sql.sql
|-- mapeo_frontend_vs_fake_sql.md
|-- mapeo_tablas_fake_sql.md
|-- package-lock.json
|-- package.json
|-- propuesta_estructurado.md
|-- render.yaml
+-- schema.sql
```

## Resumen por carpeta

- `.github/`: plantillas de issues y workflows de GitHub Actions/GitHub Pages.
- `backend/`: API REST en Node.js, Express, TypeScript, Prisma y PostgreSQL.
- `backend/prisma/`: esquema Prisma, migraciones y scripts SQL asociados.
- `backend/src/modules/`: modulos funcionales del backend: autenticacion, usuarios, ventas, inventario, clientes, empleados y reportes.
- `frontend/`: aplicacion web en Next.js y React.
- `frontend/src/app/`: rutas principales de la aplicacion.
- `frontend/src/features/`: vistas funcionales por modulo.
- `frontend/src/components/`: componentes compartidos de interfaz.
- `frontend/src/lib/`: cliente HTTP para consumir la API.
- `frontend/src/styles/`: estilos CSS del sistema.
- `docs/`: documentacion tecnica, despliegue, arquitectura, pruebas y seguimiento del proyecto.
