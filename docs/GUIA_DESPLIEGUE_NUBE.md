# Guia de despliegue en la nube

## Proveedores elegidos

- Frontend: Vercel.
- Backend: Render.
- Base de datos: Neon PostgreSQL.

## 1. Crear base de datos en Neon

1. Entrar a Neon y crear un proyecto PostgreSQL.
2. Copiar la connection string de PostgreSQL.
3. Guardarla como `DATABASE_URL` en Render.
4. Usar el formato:

```txt
postgresql://usuario:********@host.neon.tech/nombre_db?sslmode=require
```

No subir la contraseña real a GitHub ni pegarla completa en documentos publicos.

## 2. Desplegar backend en Render

Este repositorio ya incluye `render.yaml`.

En Render:

1. Crear un Blueprint desde el repositorio GitHub.
2. Render detectara el archivo `render.yaml`.
3. Completar las variables secretas:

```txt
DATABASE_URL=connection string de Neon
JWT_SECRET=clave larga y segura
FRONTEND_URL=https://tu-frontend.vercel.app
ADMIN_PASSWORD=admin123 o una contraseña nueva
```

Render ejecutara:

```txt
Build: npm ci && npm run prisma:generate -w backend && npm run build -w backend
Start: npm run start -w backend
```

Nota: en el plan gratuito de Render no se usa `preDeployCommand`. Las migraciones y el seed se ejecutan manualmente contra Neon antes del despliegue.

URL de prueba del backend:

```txt
https://mepss-erp-api.onrender.com/api/v1/health
```

## 3. Desplegar frontend en Vercel

En Vercel:

1. Importar el repositorio GitHub.
2. Elegir el directorio raiz del proyecto frontend:

```txt
frontend
```

3. Framework: Next.js.
4. Agregar variable de entorno:

```txt
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api/v1
```

5. Desplegar.

URL final del frontend:

```txt
https://mepss-erp-frontend.vercel.app
```

## 4. Ajuste final de CORS

Cuando Vercel entregue la URL final, volver a Render y actualizar:

```txt
FRONTEND_URL=https://mepss-erp-frontend.vercel.app
```

Luego redeploy del backend.

## 5. Capturas para la entrega

- Vercel mostrando el frontend desplegado.
- Render mostrando el backend desplegado y saludable.
- Neon mostrando la base PostgreSQL.
- Browser abriendo `https://tu-backend.onrender.com/api/v1/health`.
- Browser abriendo el frontend en Vercel.
- Tabla de la base en Neon, por ejemplo `usuarios`, `productos` o `ventas`.

## 6. Archivos de entrega

- `schema.sql`: script de esquema SQL.
- `docs/ENTREGABLES_ARQUITECTURA_NUBE.md`: resumen para entregar.
- `docs/GUIA_DESPLIEGUE_NUBE.md`: guia tecnica de despliegue.
- `render.yaml`: configuracion del backend para Render.
