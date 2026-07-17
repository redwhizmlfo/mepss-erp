# SISTEMA ERP ferreteria

Monorepo para un sistema comercial con Next.js, React, CSS, Node.js, Express, Prisma y PostgreSQL.

## Comandos

```bash
npm install
docker compose up -d
npm run prisma:migrate
npm run seed -w backend
npm run dev
```

PostgreSQL del proyecto usa el puerto local `54320` para evitar choque con instalaciones locales en `5432`.

Credenciales locales:

- Base de datos: `ferremas_db`
- Usuario: `postgres`
- Password: `admin 123`
- URL Prisma: `postgresql://postgres:admin%20123@localhost:54320/ferremas_db?schema=public`

## Apps

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000/api/v1/health`

## Despliegue en nube

Proveedores recomendados para la entrega:

- Frontend: Vercel.
- Backend: Render.
- Base de datos: Neon PostgreSQL.

Archivos de apoyo:

- `render.yaml`: configuracion del backend para Render.
- `schema.sql`: script SQL del esquema.
- `docs/GUIA_DESPLIEGUE_NUBE.md`: pasos de despliegue.
- `docs/ENTREGABLES_ARQUITECTURA_NUBE.md`: resumen para presentar.

## Usuario local inicial

Despues de ejecutar `npm run seed -w backend`:

- Usuario: `admin`
- Password: `admin123`

Endpoints de autenticacion:

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Endpoints de administracion inicial:

- `GET /api/v1/users/roles`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/:id`
- `PUT /api/v1/users/:id`
- `PATCH /api/v1/users/:id/status`
- `PUT /api/v1/users/:id/permissions`

Frontend:

- Variable opcional: `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`
- Si no existe, Next.js usa `http://localhost:4000/api/v1`.
- Administracion de usuarios: `http://localhost:3000/admin/users`
- En esa vista se puede crear usuarios, activar/desactivar y editar permisos por modulo.

## Stack

- Frontend: Next.js + React + CSS puro.
- Backend: Node.js + Express + TypeScript.
- ORM: Prisma.
- Base de datos: PostgreSQL.

## Gestion en GitHub

- Documentacion de implementacion: `docs/IMPLEMENTACION_PROYECTO.md`.
- Flujo de Issues, Kanban, sprints y checks: `docs/GITHUB_ISSUES_KANBAN.md`.
- Protocolo de sincronizacion con GitHub: `docs/PROTOCOLO_SINCRONIZACION_GITHUB.md`.
- Referencias visuales del flujo de Issues/Kanban/GitFlow: `docs/REFERENCIAS_VISUALES_GITHUB.md`.
- Plantilla de Issues: `.github/ISSUE_TEMPLATE/actividad.md`.

## Nueva Arquitectura de Despliegue con Docker y CI/CD

El proyecto puede desplegarse usando un entorno completamente contenerizado vía Docker Compose que funciona de manera independiente al despliegue en Vercel, Render y Neon. Esto permite:
- Validación local consistente.
- Ejecución de pruebas E2E.
- CI/CD validado mediante GitHub Actions.

### Inicio rápido con Docker

```bash
cp .env.docker.example .env
docker compose build
docker compose up -d
docker compose ps
```

### Documentación Adicional

- [Despliegue con Docker](docs/despliegue/DESPLIEGUE_DOCKER.md)
- [Workflow de GitHub Actions (CI/CD)](docs/despliegue/GITHUB_ACTIONS_DOCKER.md)
- [Manual de Usuario de GitHub](docs/gestion-github/MANUAL_USUARIO_GITHUB.md)
- [Manual de Usuario del Software](docs/manual-software/MANUAL_USUARIO_SOFTWARE.md)
- [Guía de Capturas Requeridas](docs/evidencias/GUIA_CAPTURAS.md)

> **Aclaración**: El despliegue con Docker y el workflow en Actions actúan como alternativas y verificaciones adicionales. **No reemplazan** la configuración actual en Vercel (Frontend), Render (Backend) o Neon (PostgreSQL), los cuales permanecen totalmente funcionales.
