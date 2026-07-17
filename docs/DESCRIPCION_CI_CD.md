# Descripcion de CI/CD

## Descripcion de CI

La integracion continua del proyecto se implementa con GitHub Actions mediante el archivo:

```txt
.github/workflows/ci-cd.yml
```

Este workflow valida automaticamente el proyecto cuando se realiza un `push` o un `pull_request` hacia las ramas `main` o `master`.

El objetivo del CI es comprobar que el backend y el frontend puedan instalar dependencias, generar Prisma, validar TypeScript y compilar correctamente antes de considerar estable el cambio.

Flujo general del CI:

```txt
Push o Pull Request
  -> GitHub Actions
  -> Instalar dependencias
  -> Generar cliente Prisma
  -> Validar TypeScript del backend
  -> Compilar backend y frontend
```

## 4.1.4 Implementacion de Script CI

### CI Action

Archivo usado:

```txt
.github/workflows/ci-cd.yml
```

Nombre del workflow:

```txt
CI/CD MEPSS ERP
```

Evento de ejecucion:

```yaml
on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master
```

Trabajo principal:

```txt
Validar backend y frontend
```

Pasos implementados:

```txt
1. Descargar codigo del repositorio.
2. Configurar Node.js 22.
3. Instalar dependencias con npm ci.
4. Generar cliente Prisma.
5. Validar TypeScript del backend.
6. Compilar backend y frontend.
```

Fragmento principal del script CI:

```yaml
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

Comandos validados por el CI:

```bash
npm ci
npm run prisma:generate
npm run lint -w backend
npm run build
```

## 4.1.5 Implementacion de Script CD basico

### CD Action

El despliegue continuo basico se implementa con GitHub Actions para publicar el frontend estatico en GitHub Pages.

Archivo usado:

```txt
.github/workflows/github-pages.yml
```

Nombre del workflow:

```txt
Deploy Frontend to GitHub Pages
```

Evento de ejecucion:

```yaml
on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:
```

Este workflow se ejecuta cuando hay cambios en `main` o `master`, y tambien puede ejecutarse manualmente desde la pestaña Actions de GitHub mediante `workflow_dispatch`.

Flujo general del CD:

```txt
Push a main/master
  -> GitHub Actions
  -> Instalar dependencias
  -> Compilar frontend estatico
  -> Subir artefacto a GitHub Pages
  -> Publicar sitio
```

Variables usadas para GitHub Pages:

```yaml
env:
  GITHUB_PAGES: "true"
  NEXT_PUBLIC_API_URL: https://mepss-erp-api.onrender.com/api/v1
```

La variable `GITHUB_PAGES=true` activa la configuracion estatica del frontend en `frontend/next.config.ts`.

Fragmento principal del script CD:

```yaml
jobs:
  build:
    name: Build static frontend
    runs-on: ubuntu-latest

    env:
      GITHUB_PAGES: "true"
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

      - name: Compilar frontend estatico
        run: npm run build -w frontend

      - name: Configurar GitHub Pages
        uses: actions/configure-pages@v5

      - name: Subir artefacto
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/out

  deploy:
    name: Deploy GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Publicar en GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

URL del despliegue basico en GitHub Pages:

```txt
https://redwhizmlfo.github.io/mepss-erp/
```

## Nota sobre el despliegue completo

El sistema completo es dinamico, por lo que GitHub Pages solo publica el frontend estatico. La API y la base de datos se mantienen en servicios externos:

```txt
Frontend principal: Vercel
Frontend alternativo: GitHub Pages
Backend/API: Render
Base de datos: Neon PostgreSQL
```

URLs principales:

```txt
Frontend Vercel:
https://mepss-erp-frontend.vercel.app

Frontend GitHub Pages:
https://redwhizmlfo.github.io/mepss-erp/

Backend Render:
https://mepss-erp-api.onrender.com/api/v1

Health check:
https://mepss-erp-api.onrender.com/api/v1/health
```

## Observacion tecnica

El repositorio tambien tiene preparado el workflow CD con GitHub Actions. Si GitHub Actions esta restringido por una condicion de billing de la cuenta, el frontend puede publicarse manualmente mediante la rama `gh-pages`, manteniendo el mismo resultado de despliegue en GitHub Pages.
