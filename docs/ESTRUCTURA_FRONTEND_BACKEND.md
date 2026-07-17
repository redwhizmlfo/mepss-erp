# Estructura General del Proyecto MEPSS ERP

El proyecto **MEPSS ERP** esta organizado como una aplicacion web completa, compuesta por frontend, backend, base de datos, documentacion y archivos de configuracion. Esta estructura permite separar responsabilidades, mantener el codigo ordenado y facilitar el mantenimiento del sistema.

```txt
MEPSS ERP
|-- frontend/
|   |-- public/
|   |   +-- fere.png
|   |-- src/
|   |   |-- app/
|   |   |   |-- admin/
|   |   |   |   +-- users/
|   |   |   |       |-- AdminUsersClient.tsx
|   |   |   |       +-- page.tsx
|   |   |   |-- customers/
|   |   |   |   +-- page.tsx
|   |   |   |-- employees/
|   |   |   |   |-- attendance/
|   |   |   |   |   +-- page.tsx
|   |   |   |   |-- payroll/
|   |   |   |   |   +-- page.tsx
|   |   |   |   +-- page.tsx
|   |   |   |-- inventory/
|   |   |   |   +-- products/
|   |   |   |       |-- InventoryClient.tsx
|   |   |   |       |-- ProductFormModal.tsx
|   |   |   |       +-- page.tsx
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
|   |   |-- components/
|   |   |   +-- layout/
|   |   |       |-- AppShell.tsx
|   |   |       +-- nav-items.ts
|   |   |-- features/
|   |   |   |-- admin-users/
|   |   |   |   +-- AdminUsersView.tsx
|   |   |   |-- auth/
|   |   |   |   |-- AuthGate.tsx
|   |   |   |   +-- LoginView.tsx
|   |   |   |-- customers/
|   |   |   |   +-- CustomersView.tsx
|   |   |   |-- dashboard/
|   |   |   |   +-- DashboardView.tsx
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
|   |-- next.config.ts
|   |-- package.json
|   +-- tsconfig.json
|
|-- backend/
|   |-- prisma/
|   |   |-- migrations/
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
|   |-- package.json
|   +-- tsconfig.json
|
|-- docs/
|   |-- BASE_DATOS_Y_PROMPT_PROYECTO.md
|   |-- GESTION_CAMBIOS_MODULOS.md
|   |-- IMPLEMENTACION_PROYECTO.md
|   |-- STACK_TECNICO_NEXT_NODE_PRISMA.md
|   +-- ESTRUCTURA_FRONTEND_BACKEND.md
|
|-- docker-compose.yml
|-- package.json
|-- package-lock.json
|-- README.md
|-- render.yaml
|-- schema.sql
+-- fake_sql.sql
```

## Descripcion General de la Estructura

La carpeta `frontend` contiene la aplicacion visual del sistema. Esta parte esta desarrollada con **Next.js, React y TypeScript**. Dentro de `frontend/src/app` se encuentran las rutas principales, como ventas, clientes, empleados, inventario y administracion de usuarios. La carpeta `frontend/src/features` contiene las vistas funcionales de cada modulo, por ejemplo `SalesPosView.tsx`, `CustomersView.tsx`, `PayrollView.tsx` y `DashboardView.tsx`. La carpeta `frontend/src/lib` contiene el archivo `api.ts`, que centraliza la comunicacion con el backend. Finalmente, `frontend/src/styles` almacena los estilos CSS usados por las pantallas del sistema.

La carpeta `backend` contiene la API REST del sistema. Esta parte esta desarrollada con **Node.js, Express, TypeScript, Prisma y PostgreSQL**. Dentro de `backend/src/modules` se encuentran los modulos principales del sistema: autenticacion, clientes, empleados, inventario, reportes, ventas y usuarios. Cada modulo contiene rutas o clases encargadas de procesar las solicitudes enviadas desde el frontend. La carpeta `backend/src/shared` contiene recursos compartidos, como el middleware de autenticacion, el manejador de errores HTTP, el cliente Prisma y el manejador de rutas asincronas.

La carpeta `backend/prisma` contiene la configuracion de la base de datos. El archivo `schema.prisma` define las tablas, relaciones y modelos del sistema. La carpeta `migrations` almacena los cambios aplicados a la estructura de la base de datos, permitiendo mantener control sobre la evolucion del modelo de datos.

La carpeta `docs` contiene la documentacion tecnica del proyecto. En esta carpeta se guardan documentos sobre arquitectura, implementacion, gestion de cambios, despliegue, pruebas y estructura del sistema.

## Funcion de los Archivos Principales

| Archivo o carpeta | Funcion |
|---|---|
| `frontend/src/app` | Define las rutas y paginas principales de la aplicacion. |
| `frontend/src/features` | Contiene las vistas y componentes funcionales de cada modulo. |
| `frontend/src/components/layout` | Contiene la estructura visual general y el menu de navegacion. |
| `frontend/src/lib/api.ts` | Centraliza las peticiones HTTP hacia el backend. |
| `frontend/src/styles` | Contiene los estilos CSS del sistema. |
| `backend/src/app.ts` | Configura Express, middlewares y rutas principales. |
| `backend/src/server.ts` | Inicia el servidor backend. |
| `backend/src/modules` | Agrupa la logica del backend por modulos funcionales. |
| `backend/src/shared/http-error.ts` | Define errores personalizados para la API. |
| `backend/src/shared/auth-middleware.ts` | Protege rutas privadas mediante autenticacion JWT. |
| `backend/src/shared/prisma.ts` | Centraliza la conexion con Prisma y PostgreSQL. |
| `backend/prisma/schema.prisma` | Define el modelo de base de datos. |

## Relacion Entre Frontend y Backend

El flujo general del sistema funciona de la siguiente manera:

```txt
Usuario
  |
  v
Frontend Next.js
  |
  v
frontend/src/lib/api.ts
  |
  v
Backend Express
  |
  v
Prisma ORM
  |
  v
Base de datos PostgreSQL
```

Primero, el usuario interactua con una pantalla del frontend. Luego, el frontend llama una funcion del archivo `api.ts`, que envia una peticion HTTP al backend. El backend recibe la solicitud, valida los datos, ejecuta la logica del modulo correspondiente y consulta o modifica la base de datos mediante Prisma. Finalmente, el backend devuelve una respuesta en formato JSON y el frontend actualiza la interfaz.

## Conclusion

La estructura del proyecto permite trabajar de forma ordenada y modular. El frontend se encarga de la interfaz y experiencia del usuario, mientras que el backend concentra la logica de negocio, validaciones, calculos y acceso a la base de datos. Esta organizacion facilita el mantenimiento, la escalabilidad y la documentacion del sistema MEPSS ERP.
