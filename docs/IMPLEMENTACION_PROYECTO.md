# Documentacion de Implementacion del Proyecto

Este documento define como se implementara el ERP paso a paso usando el stack vigente:

- Frontend: Next.js + React + CSS puro.
- Backend: Node.js + Express + TypeScript.
- ORM: Prisma.
- Base de datos: PostgreSQL.
- Gestion: GitHub Issues + Kanban + milestones.

La documentacion debe actualizarse a medida que avance el proyecto.

## 1. Objetivo de implementacion

Construir un ERP operativo para:

- Dashboard avanzado.
- Ventas/POS.
- Inventario.
- Proveedores y pedidos.
- Clientes.
- Empleados, asistencias, salarios y boletas.
- Perdidas.
- Reportes.
- Administracion, usuarios, roles y permisos.

Regla central:

- Ventas impacta inventario.
- Proveedores impacta inventario mediante pedidos recibidos.
- Empleados agrupa asistencia, salario y boletas.
- Reportes cruza informacion, pero no ejecuta cambios de negocio.

## 2. Estado actual del proyecto

Ya existe:

- Monorepo npm con workspaces.
- `frontend/` con Next.js, React y CSS.
- `backend/` con Express, TypeScript y Prisma.
- `docker-compose.yml` para PostgreSQL.
- Migracion inicial basada en `fake_sql.sql`.
- Migracion adicional para pedidos a proveedor.
- `schema.prisma` con modelos principales.
- Dashboard visual inicial.
- Sidebar/navbar con modulos principales.
- Documentacion de Issues, Kanban y sincronizacion GitHub.
- Autenticacion JWT inicial.
- Seed de usuario admin local.
- Middleware base de autenticacion y permisos.

Pendiente inmediato:

- Iniciar Docker Desktop.
- Ejecutar PostgreSQL con Docker Compose.
- Correr migraciones Prisma.
- Validar Prisma contra base real.
- Crear modulos backend reales por dominio.
- Conectar frontend con backend.

## 3. Arquitectura general

```txt
Usuario
  -> Frontend Next.js
    -> API REST Node.js/Express
      -> Prisma Client
        -> PostgreSQL
```

Separacion:

- `frontend/`: experiencia visual, rutas, componentes, formularios, graficos.
- `backend/`: API REST, validaciones, reglas de negocio, seguridad.
- `backend/prisma/`: modelos, migraciones y cliente Prisma.
- `docs/`: decisiones, flujo de trabajo y mapa funcional.

## 4. Estructura actual esperada

```txt
.
  .github/
    ISSUE_TEMPLATE/
      actividad.md
  backend/
    prisma/
      migrations/
      schema.prisma
    src/
      app.ts
      server.ts
      config/
      shared/
      modules/
  frontend/
    src/
      app/
      components/
      features/
      styles/
  docs/
  docker-compose.yml
  package.json
  README.md
```

## 5. Orden de implementacion por etapas

### Etapa 1: Base tecnica

Objetivo:

Dejar el proyecto ejecutable y conectado a PostgreSQL.

Checks:

- [x] Crear monorepo.
- [x] Crear frontend Next.js.
- [x] Crear backend Express.
- [x] Crear Prisma schema.
- [x] Crear migraciones iniciales.
- [x] Crear Docker Compose.
- [ ] Levantar PostgreSQL.
- [ ] Ejecutar migraciones.
- [ ] Validar endpoint health.
- [ ] Validar endpoint dashboard con base real.

Comandos:

```bash
npm install
docker compose up -d
npm run prisma:migrate
npm run prisma:generate
npm run dev
```

Nota local:

- PostgreSQL del proyecto usa el puerto host `55432`.
- Base de datos local: `ferremas_db`.
- Usuario local: `postgres`.
- Password local: `admin 123`.
- URL esperada: `postgresql://postgres:admin%20123@localhost:55432/ferremas_db?schema=public`.

Criterio de cierre:

- Frontend abre en `http://localhost:3000`.
- Backend responde en `http://localhost:4000/api/v1/health`.
- Base de datos queda migrada.

### Etapa 2: Seguridad y administracion

Objetivo:

Crear login, usuarios, roles y permisos por modulo.

Backend:

- `auth`
- `users`
- `roles`
- `permissions`

Frontend:

- Login.
- Sesion activa.
- Proteccion visual de rutas.
- Ocultar modulos sin permiso.

Checks:

- [x] Crear hash de contrasena con bcrypt.
- [x] Crear endpoint `POST /api/v1/auth/login`.
- [x] Crear endpoint `GET /api/v1/auth/me`.
- [x] Crear middleware JWT.
- [x] Crear middleware `requirePermission`.
- [x] Crear seed de usuario admin local.
- [x] Crear endpoints de administracion de usuarios.
- [x] Crear endpoint de roles.
- [x] Crear actualizacion de estado de usuario.
- [x] Crear actualizacion de permisos por modulo.
- [x] Crear UI de login.
- [x] Persistir token en frontend.
- [x] Recuperar sesion con `/auth/me`.
- [x] Filtrar navbar por permisos `canView`.
- [x] Crear logout en frontend.
- [x] Crear UI de administracion de usuarios.
- [x] Crear ruta `/admin/users`.
- [x] Crear formulario rapido de usuario.
- [x] Crear tabla de usuarios con estado, rol y permisos.
- [x] Crear accion activar/desactivar desde frontend.
- [x] Crear UI de editor de permisos.
- [x] Guardar permisos desde frontend con `PUT /api/v1/users/:id/permissions`.

Criterio de cierre:

- Un usuario puede iniciar sesion.
- Un usuario sin permiso no puede acceder al modulo protegido.
- Admin puede listar roles.
- Admin puede listar, crear, editar, activar/desactivar usuarios y reemplazar permisos.
- Frontend muestra login si no hay sesion.
- Frontend muestra dashboard y navbar permitido despues de login.
- Frontend permite administrar usuarios desde `/admin/users`.
- Frontend permite editar permisos por modulo y accion.

Usuario local inicial:

```txt
username: admin
password: admin123
```

Endpoints implementados:

- `GET /api/v1/users/roles`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/:id`
- `PUT /api/v1/users/:id`
- `PATCH /api/v1/users/:id/status`
- `PUT /api/v1/users/:id/permissions`

Frontend implementado:

- `frontend/src/app/HomeClient.tsx`
- `frontend/src/app/admin/users/page.tsx`
- `frontend/src/features/auth/LoginView.tsx`
- `frontend/src/features/auth/AuthGate.tsx`
- `frontend/src/features/admin-users/AdminUsersView.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/styles/auth.css`
- `frontend/src/styles/admin.css`

### Etapa 3: Catalogo e inventario

Objetivo:

Gestionar categorias, productos, imagenes, stock, stock minimo y kardex.

Backend:

- `catalog`
- `inventory`

Frontend:

- Productos.
- Categorias.
- Stock actual.
- Kardex.
- Ajustes.
- Stock critico.

Checks:

- [ ] CRUD categorias.
- [ ] CRUD productos.
- [ ] Filtros por categoria, nombre y estado.
- [ ] Validaciones con Zod.
- [ ] Alertas de stock minimo.
- [ ] Crear movimiento manual.
- [ ] Crear kardex por producto.
- [ ] Crear tablas frontend.
- [ ] Crear formularios frontend.

Criterio de cierre:

- Productos se crean/editan correctamente.
- Cada ajuste de stock genera movimiento.

### Etapa 4: Ventas / POS

Objetivo:

Crear punto de venta con carrito y descuento automatico de inventario.

Backend:

- `sales`
- `inventory`
- `customers`

Frontend:

- POS.
- Carrito.
- Totales.
- Metodo de pago.
- Comprobante.
- Historial de ventas.

Checks:

- [ ] Buscar productos.
- [ ] Agregar productos al carrito.
- [ ] Validar stock.
- [ ] Calcular subtotal.
- [ ] Calcular descuento.
- [ ] Calcular total.
- [ ] Crear venta transaccional.
- [ ] Crear detalle de venta.
- [ ] Descontar stock.
- [ ] Crear movimiento `sale_out`.
- [ ] Mostrar recibo o resumen.

Criterio de cierre:

- No se puede vender sin stock.
- Toda venta descuenta inventario.
- Toda venta genera movimiento.

### Etapa 5: Proveedores y pedidos

Objetivo:

Crear pedidos a proveedor y recepcion de productos.

Backend:

- `suppliers`
- `supplier-orders`
- `inventory`

Frontend:

- Proveedores.
- Pedidos.
- Recepcion.
- Historial.

Checks:

- [ ] CRUD proveedores.
- [ ] Asociar proveedor con categorias.
- [ ] Crear pedido.
- [ ] Agregar productos al pedido.
- [ ] Calcular total.
- [ ] Cambiar estado de pedido.
- [ ] Recibir pedido.
- [ ] Aumentar stock.
- [ ] Crear movimiento de inventario.
- [ ] Evitar doble recepcion.

Criterio de cierre:

- Proveedores no se mezclan con ventas.
- La recepcion alimenta inventario.

### Etapa 6: Empleados, asistencia y salarios

Objetivo:

Administrar empleados, asistencia diaria, salario y boletas.

Backend:

- `employees`
- `attendance`
- `payroll`

Frontend:

- Empleados.
- Calendario de asistencia.
- Salarios.
- Boletas de pago.

Checks:

- [ ] CRUD empleados.
- [ ] Marcar entrada.
- [ ] Marcar salida.
- [ ] Registrar falta.
- [ ] Ver asistencia mensual.
- [ ] Calcular dias trabajados.
- [ ] Calcular pago.
- [ ] Generar boleta.
- [ ] Crear detalle de boleta.

Criterio de cierre:

- La boleta se calcula desde asistencias.
- Salarios no dependen de ventas.

### Etapa 7: Perdidas

Objetivo:

Registrar perdidas y descontar inventario.

Backend:

- `losses`
- `inventory`

Frontend:

- Registrar perdida.
- Historial.
- Motivos.
- Perdidas por producto/categoria.

Checks:

- [ ] Listar motivos de perdida.
- [ ] Crear perdida.
- [ ] Calcular costo total.
- [ ] Descontar stock.
- [ ] Crear movimiento `loss_out`.
- [ ] Mostrar historial.
- [ ] Agregar filtros por fecha, motivo y producto.

Criterio de cierre:

- Toda perdida reduce inventario.
- Toda perdida genera movimiento.

### Etapa 8: Dashboard avanzado y reportes

Objetivo:

Mostrar metricas, graficos e insights por modulo.

Backend:

- `reports`
- agregaciones SQL/Prisma.

Frontend:

- Dashboard ejecutivo.
- Graficos Recharts.
- Reportes por modulo.

Checks:

- [ ] KPIs de ventas.
- [ ] KPIs de inventario.
- [ ] KPIs de proveedores.
- [ ] KPIs de empleados.
- [ ] KPIs de clientes.
- [ ] KPIs de perdidas.
- [ ] Graficos de tendencia.
- [ ] Rankings.
- [ ] Heatmaps.
- [ ] Alertas operativas.
- [ ] Filtros por periodo.

Criterio de cierre:

- Cada modulo tiene resumen en dashboard.
- Cada grafico tiene fuente clara y enlace al modulo.

### Etapa 9: QA, responsive y cierre

Objetivo:

Validar que el sistema sea usable, estable y documentado.

Checks:

- [ ] Build backend.
- [ ] Build frontend.
- [ ] Pruebas manuales de flujo principal.
- [ ] Revisar responsive.
- [ ] Revisar estados vacios.
- [ ] Revisar errores.
- [ ] Actualizar README.
- [ ] Actualizar docs.
- [ ] Cerrar Issues.

Criterio de cierre:

- Proyecto compila.
- Flujos principales funcionan.
- GitHub queda sincronizado.

## 6. Convencion de modulos backend

Cada modulo backend debe tener:

```txt
modules/nombre/
  nombre.routes.ts
  nombre.service.ts
  nombre.schemas.ts
  nombre.types.ts
```

Reglas:

- `routes`: define endpoints.
- `schemas`: valida entrada con Zod.
- `service`: contiene reglas de negocio.
- `types`: tipos especificos del modulo si hacen falta.
- El acceso a base de datos se hace mediante Prisma.

## 7. Convencion de features frontend

Cada feature frontend debe tener:

```txt
features/nombre/
  NombrePage.tsx
  components/
  hooks/
  api.ts
  types.ts
```

Reglas:

- Componentes visuales pequenos van en `components/`.
- Componentes compartidos globales van en `components/ui`.
- Estilos globales y tokens van en `styles/`.
- La UI debe seguir el estilo luxury definido.

## 8. Criterios tecnicos por entrega

Cada entrega debe cumplir:

- TypeScript sin errores.
- Backend build OK si se toca backend.
- Frontend build OK si se toca frontend.
- Prisma generate OK si se toca schema.
- Documentacion actualizada si cambia flujo, modulo o comando.
- Commit y push a GitHub.

## 9. Checklist para cada ciclo de trabajo

```txt
1. Revisar Issue o crear uno.
2. Confirmar modulo afectado.
3. Implementar cambio.
4. Ejecutar verificacion.
5. Actualizar documentacion.
6. Revisar git diff.
7. Commit.
8. Push.
9. Reportar resultado.
```

## 10. Sincronizacion con GitHub

Este documento trabaja junto con:

- `docs/GITHUB_ISSUES_KANBAN.md`
- `docs/PROTOCOLO_SINCRONIZACION_GITHUB.md`
- `docs/REFERENCIAS_VISUALES_GITHUB.md`

Cada avance debe quedar reflejado en GitHub mediante:

- Issue actualizado.
- Commit asociado.
- Push a `origin/main` o a rama de feature.
- Documentacion actualizada.
