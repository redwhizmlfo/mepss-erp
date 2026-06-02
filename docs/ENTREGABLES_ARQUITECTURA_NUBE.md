# Entregables de arquitectura cliente-servidor y nube

## 1. Arquitectura cliente-servidor

El proyecto MEPSS ERP usa una arquitectura cliente-servidor:

- Cliente: frontend web en Next.js + React. Es la interfaz que usa el usuario desde el navegador.
- Servidor: backend en Node.js + Express + TypeScript. Expone una API REST para login, usuarios, ventas, inventario, productos y reportes.
- Base de datos: PostgreSQL. Guarda usuarios, roles, permisos, productos, ventas, inventario, clientes, proveedores y movimientos.
- ORM: Prisma. El backend usa Prisma para conectarse a PostgreSQL y ejecutar consultas.

Flujo principal:

```txt
Usuario
  -> Navegador web
  -> Frontend Next.js
  -> API REST Node.js / Express
  -> Prisma ORM
  -> Base de datos PostgreSQL
```

## 2. URLs que se deben entregar

Cuando el proyecto esté en la nube, se deben entregar estas URL:

```txt
URL del frontend:
https://TU-FRONTEND.vercel.app

URL del backend:
https://TU-BACKEND.onrender.com/api/v1

URL de prueba del backend:
https://TU-BACKEND.onrender.com/api/v1/health

URL o connection string de la base de datos:
postgresql://USUARIO:CONTRASENA@HOST:PUERTO/NOMBRE_DB?sslmode=require
```

Importante: si la connection string contiene contraseña real, no debe publicarse completa. Para la entrega se puede ocultar:

```txt
postgresql://usuario:********@host.neon.tech/nombre_db?sslmode=require
```

## 3. Proveedor de base de datos en la nube

El proyecto usa PostgreSQL, por eso se puede subir a un proveedor cloud compatible con PostgreSQL.

Proveedor recomendado:

```txt
Neon PostgreSQL
```

Alternativas validas:

```txt
Supabase PostgreSQL
Railway PostgreSQL
Render PostgreSQL
```

Para esta entrega se recomienda decir:

```txt
Proveedor elegido para la base de datos en la nube: Neon PostgreSQL.
Motor de base de datos: PostgreSQL.
ORM usado por el backend: Prisma.
```

## 4. Base de datos fisica/local

Actualmente el proyecto tiene una base de datos local ejecutada con Docker.

Datos locales:

```txt
Motor: PostgreSQL
Contenedor Docker: luxury_ops_postgres
Base de datos: ferremas_db
Host: localhost
Puerto externo: 54320
Usuario: postgres
```

Captura sugerida para "base de datos fisica":

- Docker Desktop mostrando el contenedor `luxury_ops_postgres` activo.
- pgAdmin, DBeaver o TablePlus mostrando la base `ferremas_db`.
- Lista de tablas como `usuarios`, `roles`, `productos`, `ventas`, `proveedores`.

## 5. Base de datos en la nube

Captura sugerida para "base de datos en la nube":

- Panel del proveedor cloud, por ejemplo Neon o Supabase.
- Proyecto/base PostgreSQL creada.
- Host o connection string visible, ocultando la contraseña.
- Tabla o consola SQL mostrando que existen las tablas del proyecto.

Texto recomendado:

```txt
La base de datos fue desplegada en un proveedor cloud PostgreSQL. El backend se conecta a esta base mediante la variable de entorno DATABASE_URL.
```

## 6. Script de esquema SQL

El script del esquema se puede entregar desde:

```txt
schema.sql
```

El archivo `schema.sql` fue generado desde el esquema Prisma actual con:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel backend/prisma/schema.prisma --script
```

Nombre sugerido para entregar:

```txt
schema.sql
```

Ese archivo debe contener las instrucciones `CREATE TABLE`, `CREATE INDEX` y `ALTER TABLE ... FOREIGN KEY` necesarias para crear la estructura de la base de datos.

## 7. Proyecto completo en la nube

Para que todo el proyecto quede en la nube:

- Frontend Next.js: desplegar en Vercel.
- Backend Node.js/Express: desplegar en Render.
- Base de datos PostgreSQL: desplegar en Neon PostgreSQL.

Variables de entorno necesarias en backend:

```txt
DATABASE_URL=postgresql://...
PORT=4000
JWT_SECRET=clave-secreta-segura
FRONTEND_URL=https://TU-FRONTEND.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Variables de entorno necesarias en frontend:

```txt
NEXT_PUBLIC_API_URL=https://TU-BACKEND.onrender.com/api/v1
```

## 8. Resumen para exponer

```txt
El sistema MEPSS ERP esta construido con arquitectura cliente-servidor. El cliente es una aplicacion web en Next.js/React y el servidor es una API REST en Node.js/Express. El backend se comunica con una base de datos PostgreSQL usando Prisma ORM. En local, la base se ejecuta con Docker; en nube, la base se despliega en un proveedor PostgreSQL como Neon. El frontend puede desplegarse en Vercel y el backend en Render. La conexion entre backend y base se configura mediante DATABASE_URL.
```

## 9. Checklist de entrega

- [ ] Diagrama o descripcion de arquitectura cliente-servidor.
- [ ] URL del frontend en la nube.
- [ ] URL del backend en la nube.
- [ ] URL de prueba del backend `/api/v1/health`.
- [ ] Nombre del proveedor de base de datos cloud.
- [ ] Connection string de la base cloud con contraseña oculta.
- [ ] Captura de base local/fisica.
- [ ] Captura de base en la nube.
- [ ] Archivo `schema.sql`.
- [ ] Captura del sistema funcionando en la nube.
