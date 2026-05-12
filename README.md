# Luxury Ops Suite

Monorepo para un sistema comercial con Next.js, React, CSS, Node.js, Express, Prisma y PostgreSQL.

## Comandos

```bash
npm install
docker compose up -d
npm run prisma:migrate
npm run dev
```

PostgreSQL del proyecto usa el puerto local `55432` para evitar choque con instalaciones locales en `5432`.

Credenciales locales:

- Base de datos: `ferremas_db`
- Usuario: `postgres`
- Password: `admin 123`
- URL Prisma: `postgresql://postgres:admin%20123@localhost:55432/ferremas_db?schema=public`

## Apps

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000/api/v1/health`

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
