# Manual de Usuario de GitHub

## 1. Objetivo
Establecer un flujo de trabajo estándar y organizado para el uso de Git y GitHub dentro del proyecto MEPSS ERP, asegurando calidad de código e integración continua.

## 2. Acceso al repositorio
El repositorio se encuentra alojado en GitHub. Debes tener acceso de escritura otorgado por el administrador.
URL del repositorio: `https://github.com/redwhizmlfo/mepss-erp.git`

## 3. Estructura del repositorio
- `/backend`: Código fuente del backend (Node.js, Express, Prisma).
- `/frontend`: Código fuente del frontend (Next.js).
- `/docs`: Documentación técnica y manuales.
- `.github/workflows`: Flujos de trabajo de automatización (CI/CD).
- `docker-compose.yml`: Archivo de orquestación de contenedores.

## 4. Clonación
Para trabajar localmente, clona el repositorio usando SSH o HTTPS:
```bash
git clone https://github.com/redwhizmlfo/mepss-erp.git
cd mepss-erp
```

## 5. Instalación
Consulta el README principal y el manual de Docker para levantar el entorno. Puedes usar:
- Enfoque nativo: `npm ci` en frontend y backend.
- Enfoque contenedorizado: `docker compose up -d` (requiere preparación de `.env`).

## 6. Creación de ramas
Nunca trabajes directamente en la rama `main`. Crea una rama nueva a partir de la última versión de `main`:
```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-funcionalidad
```

## 7. Convención de nombres de ramas
Usa prefijos para categorizar tu trabajo:
- `feature/`: Nuevas funcionalidades (ej. `feature/login`).
- `bugfix/`: Corrección de errores (ej. `bugfix/error-cors`).
- `docs/`: Cambios exclusivos de documentación (ej. `docs/actualizar-readme`).
- `chore/`: Tareas de mantenimiento o configuración (ej. `chore/docker-setup`).

## 8. Convención de commits
Aplica _Conventional Commits_:
- `feat: añade botón de login`
- `fix: corrige error de CORS en producción`
- `docs: actualiza el manual de GitHub`
- `chore: actualiza dependencias`

## 9. Creación y gestión de Issues
Para cada tarea, reporte de error o mejora, crea un **Issue** en GitHub antes de escribir código. Proporciona:
- Título claro.
- Descripción del problema o funcionalidad esperada.
- Criterios de aceptación.

## 10. Uso del tablero Kanban
El proyecto puede usar **GitHub Projects** (tablero Kanban) para seguimiento. Las columnas habituales son:
- **To Do**: Tareas planificadas.
- **In Progress**: Tareas en desarrollo.
- **In Review**: Pull Requests abiertos pendientes de aprobación.
- **Done**: Tareas integradas en `main`.

## 11. Creación de Pull Requests (PR)
Una vez terminada tu rama, súbela a GitHub y crea un PR:
```bash
git push origin nombre-de-la-rama
```
En GitHub, crea el Pull Request hacia `main`. Enlaza el Issue correspondiente.

## 12. Revisión y aprobación
Otro miembro del equipo debe revisar tu código. Consideraciones:
- El código no debe romper la aplicación.
- Las validaciones automáticas (Actions) deben pasar en verde.
- Si hay comentarios, aplica los cambios, haz commit y vuelve a subir (push).

## 13. Resolución de conflictos
Si GitHub indica conflictos con `main`:
```bash
git checkout main
git pull origin main
git checkout nombre-de-la-rama
git merge main
# Resuelve los conflictos en tu editor
git add .
git commit -m "Merge main y resolver conflictos"
git push origin nombre-de-la-rama
```

## 14. Uso de GitHub Actions
Cada PR y push a `main` activa flujos automáticos. Verifica siempre en la pestaña **Actions** que la construcción del Docker y las pruebas de salud pasen exitosamente.

## 15. Consulta de despliegues
- **Vercel**: El frontend se despliega automáticamente en Vercel tras cada push a `main`.
- **Render**: El backend se despliega automáticamente en Render tras cada push a `main`.

## 16. Consulta de paquetes Docker
Al hacer push a `main`, las imágenes de backend y frontend se compilan y suben a GitHub Container Registry (GHCR). Las puedes visualizar en la sección "Packages" del repositorio.

## 17. Proceso recomendado de sincronización
1. Pull de `main`.
2. Crear rama.
3. Desarrollar y hacer commits.
4. Push de la rama.
5. Crear PR.
6. Pasar Code Review y CI/CD.
7. Merge a `main`.

## 18. Buenas prácticas
- Haz commits pequeños y atómicos.
- No subas archivos temporales (`node_modules`, `.env`).
- Ejecuta pruebas locales antes de hacer push.

## 19. Evidencias requeridas
Al entregar el trabajo, guíate por [GUIA_CAPTURAS.md](../evidencias/GUIA_CAPTURAS.md) para generar el archivo de capturas comprobatorias de tus operaciones.
