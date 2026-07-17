# Gestion de Proyectos mediante CI/CD

## Proyecto

**MEPSS ERP** es un sistema web con frontend en Next.js, backend en Node.js/Express, Prisma ORM y base de datos PostgreSQL en Neon. El proyecto utiliza GitHub Actions para automatizar validaciones y despliegues relacionados con la rama principal del repositorio.

Para cumplir con el requerimiento de desarrollar por lo menos **03 scripts CI/CD**, se identifican y documentan los siguientes scripts aplicados al proyecto:

1. **Script CI:** validacion automatica de backend y frontend.
2. **Script CD basico:** confirmacion del flujo de despliegue hacia Vercel, Render y Neon.
3. **Script CD GitHub Pages:** despliegue del frontend estatico en GitHub Pages.

---

## Script 1: CI Action - Validacion del Proyecto

Este script corresponde a la etapa de **Integracion Continua (CI)**. Su objetivo es verificar que el codigo del proyecto compile correctamente antes de aceptar cambios en la rama principal.

El flujo realiza las siguientes tareas:

- Descarga el codigo del repositorio.
- Configura Node.js.
- Instala dependencias con `npm ci`.
- Genera el cliente de Prisma.
- Valida TypeScript del backend.
- Compila backend y frontend.

Archivo utilizado:

```txt
.github/workflows/ci-cd.yml
```

Contenido del script CI:

```yaml
name: CI/CD MEPSS ERP

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

Resultado esperado:

```txt
El workflow valida que el backend y el frontend puedan compilar correctamente antes de continuar con el proceso de despliegue.
```

---

## Script 2: CD Action Basico - Flujo de Despliegue Vercel, Render y Neon

Este script corresponde a una etapa de **Despliegue Continuo basico (CD)**. Su finalidad es dejar registrado dentro de GitHub Actions el flujo de despliegue usado por el proyecto.

En este proyecto, los servicios de produccion estan distribuidos de la siguiente forma:

- **Frontend:** Vercel.
- **Backend:** Render.
- **Base de datos:** Neon PostgreSQL.

El job `deploy-info` se ejecuta despues de que la validacion CI termina correctamente. No reemplaza a Vercel ni Render, pero documenta y confirma el flujo automatizado de despliegue conectado al repositorio.

Archivo utilizado:

```txt
.github/workflows/ci-cd.yml
```

Contenido del script CD basico:

```yaml
  deploy-info:
    name: Informacion de despliegue
    runs-on: ubuntu-latest
    needs: validate
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')

    steps:
      - name: Confirmar flujo de despliegue
        run: |
          echo "Validacion completada."
          echo "Frontend: desplegar desde Vercel conectado al repositorio."
          echo "Backend: desplegar desde Render conectado al repositorio."
          echo "Base de datos: usar PostgreSQL en Neon con DATABASE_URL configurado en Render."
```

Resultado esperado:

```txt
Cuando el codigo se sube a main, primero se valida el proyecto. Si la validacion es correcta, GitHub Actions confirma que el despliegue productivo se realiza mediante Vercel, Render y Neon.
```

---

## Script 3: CD Action - Despliegue Frontend en GitHub Pages

Este script corresponde a una segunda etapa de **Despliegue Continuo (CD)**. Su objetivo es construir una version estatica del frontend y publicarla en GitHub Pages.

El flujo realiza las siguientes tareas:

- Descarga el codigo fuente.
- Configura Node.js.
- Instala dependencias.
- Compila el frontend en modo estatico.
- Configura GitHub Pages.
- Sube el artefacto generado.
- Publica el frontend en GitHub Pages.

Archivo utilizado:

```txt
.github/workflows/github-pages.yml
```

Contenido del script CD para GitHub Pages:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

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

Resultado esperado:

```txt
El frontend se compila como sitio estatico y se publica en GitHub Pages usando el artefacto generado en frontend/out.
```

URL de referencia del despliegue:

```txt
https://redwhizmlfo.github.io/mepss-erp/
```

---

## Resumen de los 03 Scripts CI/CD

| Nro. | Tipo | Nombre del script | Archivo | Funcion |
|---:|---|---|---|---|
| 1 | CI | Validar backend y frontend | `.github/workflows/ci-cd.yml` | Instala dependencias, genera Prisma, valida backend y compila el proyecto. |
| 2 | CD basico | Informacion de despliegue | `.github/workflows/ci-cd.yml` | Confirma el flujo de despliegue hacia Vercel, Render y Neon. |
| 3 | CD | Deploy Frontend to GitHub Pages | `.github/workflows/github-pages.yml` | Compila y publica el frontend estatico en GitHub Pages. |

## Conclusion

El proyecto cuenta con tres scripts CI/CD documentados y alineados a su arquitectura real. La integracion continua permite verificar el codigo antes de desplegar, mientras que los scripts de despliegue continuo cubren el flujo productivo con Vercel, Render y Neon, ademas de la publicacion del frontend en GitHub Pages.
