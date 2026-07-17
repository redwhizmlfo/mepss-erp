# Despliegue con Docker

## Objetivo
Proporcionar una alternativa local y contenerizada para ejecutar el proyecto MEPSS ERP completo (Frontend, Backend y Base de Datos) de manera unificada, sin afectar los entornos de producción desplegados en Vercel, Render y Neon.

## Arquitectura
La arquitectura de contenedores se basa en:
- **postgres**: Base de datos PostgreSQL con almacenamiento persistente.
- **backend**: API Express en Node.js que se conecta a PostgreSQL.
- **frontend**: Aplicación Next.js que consume la API del backend.

> [!NOTE]
> Docker **no reemplaza** el despliegue de Vercel y Render. Sirve como alternativa adicional para desarrollo, pruebas locales y validación de flujos CI/CD.

## Requisitos previos
- Docker Desktop (o Docker Engine).
- Git instalado.

## Archivos Docker creados
- `docker-compose.yml`: Define y orquesta los servicios.
- `backend/Dockerfile`: Define la construcción multietapa del backend.
- `frontend/Dockerfile`: Define la construcción multietapa del frontend.
- `.env.docker.example`: Archivo base con las variables de entorno para Docker.

## Variables de entorno
Antes de iniciar, debes preparar las variables de entorno. Copia el archivo `.env.docker.example` a `.env`:
```bash
cp .env.docker.example .env
```
Ajusta valores como contraseñas si es necesario. **Nota:** No guardes secretos reales de producción en tu `.env` local.

## Comandos de despliegue

### 1. Construir las imágenes
```bash
docker compose build
```

### 2. Iniciar los contenedores en segundo plano
```bash
docker compose up -d
```

### 3. Comprobar el estado de los contenedores
```bash
docker compose ps
```
Asegúrate de que todos los servicios (`postgres`, `backend`, `frontend`) estén corriendo y reporten "healthy" (en el caso de la base de datos y backend).

### 4. Ejecución de migraciones
En un entorno de desarrollo puro podrías usar `dev`, pero para despliegues simulando producción, utiliza:
```bash
docker compose exec backend npx prisma migrate deploy
```

## URLs locales
- **Frontend**: http://localhost:3000
- **Backend Health Check**: http://localhost:4000/api/v1/health

## Revisión de logs
Para revisar los logs de todos los servicios:
```bash
docker compose logs -f
```
Para revisar un servicio en particular (ejemplo: backend):
```bash
docker compose logs -f backend
```

## Detención de los servicios
Para apagar los servicios de forma segura sin borrar los datos:
```bash
docker compose down
```
Para apagar los servicios y borrar la base de datos local (volúmenes):
```bash
docker compose down -v
```

## Solución de errores comunes
- **Puerto en uso**: Si el puerto 3000 o 4000 está ocupado, detén el proceso que lo usa o edita las variables `FRONTEND_PORT`/`BACKEND_PORT` en el `.env`.
- **Error conectando a la base de datos**: Verifica que el contenedor `postgres` esté levantado y `DATABASE_URL` sea correcta en `.env`.
