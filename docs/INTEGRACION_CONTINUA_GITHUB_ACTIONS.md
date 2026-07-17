# Integracion Continua - GitHub Actions

## Proyecto

El proyecto **MEPSS ERP** utiliza GitHub Actions como herramienta de integracion continua. La integracion continua permite validar automaticamente el codigo cada vez que se realiza un `push` o un `pull request` hacia la rama principal del repositorio.

Para esta seccion se proponen **05 acciones CI**, alineadas con la arquitectura real del proyecto:

- Frontend: Next.js.
- Backend: Node.js con Express.
- ORM: Prisma.
- Base de datos: PostgreSQL en Neon.
- Repositorio: GitHub.

---

## CI 1: Instalacion de Dependencias

Esta accion valida que el proyecto pueda instalar correctamente sus dependencias usando `npm ci`. Es importante porque el proyecto trabaja con workspaces para backend y frontend.

```yaml
name: CI - Instalar dependencias

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  install:
    name: Instalar dependencias del proyecto
    runs-on: ubuntu-latest

    steps:
      - name: Descargar codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependencias
        run: npm ci
```

Objetivo:

```txt
Comprobar que las dependencias del backend y frontend se instalen correctamente en un entorno limpio.
```

---

## CI 2: Generacion del Cliente Prisma

Esta accion valida que Prisma pueda generar su cliente a partir del esquema de base de datos definido en el backend.

```yaml
name: CI - Prisma Generate

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  prisma:
    name: Generar cliente Prisma
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ferremas_db?schema=public

    steps:
      - name: Descargar codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependencias
        run: npm ci

      - name: Generar cliente Prisma
        run: npm run prisma:generate
```

Objetivo:

```txt
Verificar que el esquema Prisma sea valido y que el cliente de base de datos pueda generarse sin errores.
```

---

## CI 3: Validacion del Backend

Esta accion valida el backend del sistema. Ejecuta la revision de TypeScript y permite detectar errores de codigo antes del despliegue.

```yaml
name: CI - Backend

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  backend:
    name: Validar backend
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ferremas_db?schema=public
      JWT_SECRET: github-actions-secret
      FRONTEND_URL: http://localhost:3000

    steps:
      - name: Descargar codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependencias
        run: npm ci

      - name: Generar Prisma Client
        run: npm run prisma:generate

      - name: Validar TypeScript del backend
        run: npm run lint -w backend

      - name: Compilar backend
        run: npm run build -w backend
```

Objetivo:

```txt
Detectar errores en rutas, servicios, controladores, conexion con Prisma y configuracion del backend.
```

---

## CI 4: Validacion del Frontend

Esta accion valida que el frontend desarrollado con Next.js compile correctamente y pueda consumir la URL del backend configurada.

```yaml
name: CI - Frontend

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  frontend:
    name: Validar frontend
    runs-on: ubuntu-latest

    env:
      NEXT_PUBLIC_API_URL: https://mepss-erp-api.onrender.com/api/v1

    steps:
      - name: Descargar codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependencias
        run: npm ci

      - name: Compilar frontend
        run: npm run build -w frontend
```

Objetivo:

```txt
Comprobar que las paginas, componentes y configuracion del frontend se generen correctamente.
```

---

## CI 5: Validacion Completa del Proyecto

Esta accion integra las validaciones principales en un solo flujo. Es la accion CI usada como referencia principal dentro del repositorio.

```yaml
name: CI - Validacion completa MEPSS ERP

on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master

jobs:
  validate:
    name: Validar backend y frontend
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ferremas_db?schema=public
      JWT_SECRET: github-actions-secret
      FRONTEND_URL: http://localhost:3000
      NEXT_PUBLIC_API_URL: http://localhost:4000/api/v1

    steps:
      - name: Descargar codigo
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependencias
        run: npm ci

      - name: Generar cliente Prisma
        run: npm run prisma:generate

      - name: Validar TypeScript del backend
        run: npm run lint -w backend

      - name: Compilar backend y frontend
        run: npm run build
```

Objetivo:

```txt
Ejecutar una validacion integral antes de aceptar cambios en la rama principal del repositorio.
```

---

## Resumen de Acciones CI

| Nro. | Accion CI | Herramienta | Proposito |
|---:|---|---|---|
| 1 | Instalacion de dependencias | npm ci | Verifica que el proyecto instale correctamente sus paquetes. |
| 2 | Generacion Prisma | Prisma | Valida el esquema y genera el cliente ORM. |
| 3 | Validacion backend | Node.js / TypeScript | Revisa y compila el backend. |
| 4 | Validacion frontend | Next.js | Compila la aplicacion frontend. |
| 5 | Validacion completa | GitHub Actions | Integra las validaciones principales del proyecto. |

## Conclusion

La integracion continua del proyecto MEPSS ERP permite detectar errores antes del despliegue, mantener estable la rama principal y asegurar que backend, frontend y Prisma funcionen correctamente en un entorno automatizado de GitHub Actions.
