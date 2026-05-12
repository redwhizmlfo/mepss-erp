# Stack Tecnico Vigente

Este proyecto se construira con:

- Frontend: Next.js + React + CSS puro.
- Backend: Node.js + Express + TypeScript.
- ORM: Prisma.
- Base de datos: PostgreSQL.
- Autenticacion: JWT.
- Validacion: Zod.
- Graficos: Recharts en el frontend.

## Estructura de monorepo

```txt
backend/
  prisma/
    schema.prisma
    migrations/
  src/
    app.ts
    server.ts
    config/
    modules/
    shared/
frontend/
  src/
    app/
    components/
    features/
    styles/
```

## Responsabilidad del backend

- Exponer API REST.
- Validar entrada con Zod.
- Consultar PostgreSQL con Prisma.
- Ejecutar reglas de negocio transaccionales.
- Proteger rutas con JWT y permisos.
- Servir metricas agregadas para dashboard.

## Responsabilidad del frontend

- Renderizar UI luxury con Next.js.
- Usar CSS puro organizado por tokens y componentes.
- Mostrar navbar con modulos y submodulos.
- Consumir API REST del backend.
- Mostrar dashboard avanzado con KPIs, graficos, alertas e insights.

## Modulos principales

- Dashboard.
- Ventas.
- Inventario.
- Proveedores y pedidos.
- Clientes.
- Empleados.
- Perdidas.
- Reportes.
- Administracion.

## Comandos esperados

```bash
npm install
npm run dev
npm run build
```

En la raiz, los scripts deben orquestar frontend y backend.

