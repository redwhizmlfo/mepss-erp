# Mapeo frontend vs `fake_sql.sql`

Este documento cruza los modulos visibles/implementados en el frontend con las tablas definidas en `fake_sql.sql`.

## Resumen ejecutivo

- Frontend: Next.js en `frontend/`.
- Rutas implementadas reales:
  - `/`: login protegido + dashboard.
  - `/admin/users`: administracion de usuarios y permisos.
- Rutas declaradas en menu pero sin pagina implementada:
  - `/sales/pos`
  - `/inventory/products`
  - `/suppliers`
  - `/customers`
  - `/employees`
  - `/losses`
  - `/reports`
- El menu muestra 9 modulos funcionales, pero solo 2 tienen pantalla real.
- El cliente API frontend solo consume autenticacion y usuarios/roles.
- El dashboard usa datos mock en pantalla, aunque el backend tiene endpoint `/api/v1/reports/dashboard/executive`.

## Archivos frontend revisados

| Archivo | Uso |
| --- | --- |
| `frontend/src/app/page.tsx` | Entrada de la ruta `/` |
| `frontend/src/app/HomeClient.tsx` | Carga `AuthGate` y `DashboardView` |
| `frontend/src/app/admin/users/page.tsx` | Entrada de `/admin/users` |
| `frontend/src/app/admin/users/AdminUsersClient.tsx` | Carga `AuthGate` y `AdminUsersView` |
| `frontend/src/features/auth/AuthGate.tsx` | Manejo de sesion, token y usuario actual |
| `frontend/src/features/auth/LoginView.tsx` | Pantalla de login |
| `frontend/src/features/dashboard/DashboardView.tsx` | Dashboard ejecutivo con metricas mock |
| `frontend/src/features/admin-users/AdminUsersView.tsx` | CRUD parcial de usuarios y editor de permisos |
| `frontend/src/components/layout/AppShell.tsx` | Layout principal, sidebar, topbar y filtro por permisos |
| `frontend/src/components/layout/nav-items.ts` | Declaracion de modulos del menu |
| `frontend/src/lib/api.ts` | Cliente API disponible para frontend |

## Modulos detectados en frontend

| Modulo frontend | Ruta declarada | Permiso usado | Estado actual |
| --- | --- | --- | --- |
| Dashboard | `/` | `dashboard` | Implementado, pero con datos mock |
| Ventas | `/sales/pos` | `ventas` | Solo aparece en menu |
| Inventario | `/inventory/products` | `inventario` | Solo aparece en menu |
| Proveedores y pedidos | `/suppliers` | `proveedores` | Solo aparece en menu |
| Clientes | `/customers` | `clientes` | Solo aparece en menu |
| Empleados | `/employees` | `empleados` | Solo aparece en menu |
| Perdidas | `/losses` | `perdidas` | Solo aparece en menu |
| Reportes | `/reports` | `reportes` | Solo aparece en menu |
| Administracion | `/admin/users` | `usuarios` | Implementado parcialmente |

## API consumida por el frontend

| Funcion frontend | Endpoint | Tablas relacionadas |
| --- | --- | --- |
| `login` | `POST /auth/login` | `usuarios`, `roles`, `empleados`, `user_permissions` |
| `getMe` | `GET /auth/me` | `usuarios`, `roles`, `empleados`, `user_permissions` |
| `listUsers` | `GET /users?pageSize=50` | `usuarios`, `roles`, `empleados`, `user_permissions` |
| `listRoles` | `GET /users/roles` | `roles` |
| `createUser` | `POST /users` | `usuarios`, `user_permissions`, `roles` |
| `updateUserStatus` | `PATCH /users/:id/status` | `usuarios` |
| `replaceUserPermissions` | `PUT /users/:id/permissions` | `user_permissions`, `usuarios` |

Endpoint backend existente pero no consumido por el frontend:

| Endpoint | Uso esperado | Estado frontend |
| --- | --- | --- |
| `GET /reports/dashboard/executive` | KPIs, alertas y graficos del dashboard | Falta conectar `DashboardView` |

## Cruce por tabla de `fake_sql.sql`

| Tabla | Modulo esperado | Cobertura frontend actual | Falta para alinear |
| --- | --- | --- | --- |
| `roles` | Administracion | Se lista para crear usuarios | Pantalla/catalogo de roles si se requiere administrar roles |
| `empleados` | Empleados, Usuarios, Ventas, Asistencias, Boletas | Solo se muestra empleado vinculado en usuarios | CRUD empleados, selector al crear usuario, detalle laboral |
| `usuarios` | Administracion | Listar, crear, activar/desactivar | Edicion de usuario, vincular empleado, cambiar password |
| `user_permissions` | Administracion | Editor de permisos implementado | Alinear lista de `module_key` con modulos reales y backend |
| `categorias` | Inventario, Proveedores | Sin pantalla | CRUD categorias, activar/desactivar, uso en productos y proveedores |
| `productos` | Inventario, Ventas, Perdidas | Sin pantalla real | CRUD productos, stock, precios, stock minimo, busqueda |
| `imagenes_producto` | Inventario | Sin pantalla | Galeria/imagenes por producto, imagen principal, orden 1-4 |
| `proveedores` | Proveedores | Sin pantalla | CRUD proveedores, contacto, RUC, estado |
| `proveedor_categoria` | Proveedores | Sin pantalla | Asignar categorias que atiende cada proveedor |
| `metodos_pago` | Ventas, Catalogos | Sin pantalla | Catalogo o selector en POS |
| `tipos_comprobante` | Ventas, Catalogos | Sin pantalla | Selector de boleta/factura/sin comprobante |
| `clientes` | Clientes, Ventas | Sin pantalla | CRUD clientes, busqueda por documento, historial |
| `ventas` | Ventas, Dashboard, Reportes | Dashboard mock solamente | POS, registrar venta, historial, comprobantes, reportes |
| `detalle_venta` | Ventas | Sin pantalla | Carrito/detalle de productos vendidos |
| `asistencias_empleado` | Empleados | Dashboard mock menciona asistencias | Registro entrada/salida, estados, calendario/listado |
| `motivos_perdida` | Perdidas | Sin pantalla | Catalogo de motivos |
| `perdidas_inventario` | Perdidas, Inventario | Dashboard mock menciona perdidas | Registrar perdida, historial, impacto en stock |
| `boletas_pago_empleado` | Empleados / Nomina | Dashboard mock menciona boletas | Generacion/listado de boletas por periodo |
| `detalle_boleta_pago` | Empleados / Nomina | Sin pantalla | Detalle de dias trabajados y montos |
| `movimientos_inventario` | Inventario | Sin pantalla | Kardex, ajustes manuales, entradas/salidas |

## Modulos que faltan construir

### 1. Inventario

Tablas base:

- `categorias`
- `productos`
- `imagenes_producto`
- `movimientos_inventario`

Pantallas necesarias:

- Listado de productos.
- Crear/editar producto.
- Gestion de categorias.
- Stock bajo.
- Kardex/movimientos.
- Ajustes de inventario.
- Imagenes del producto.

Endpoints/API frontend necesarios:

- `listProducts`
- `createProduct`
- `updateProduct`
- `updateProductStatus`
- `listCategories`
- `createCategory`
- `listInventoryMovements`
- `createInventoryMovement`
- `uploadOrRegisterProductImage`

### 2. Ventas

Tablas base:

- `ventas`
- `detalle_venta`
- `clientes`
- `productos`
- `metodos_pago`
- `tipos_comprobante`
- `movimientos_inventario`

Pantallas necesarias:

- Punto de venta/POS.
- Busqueda y seleccion de productos.
- Carrito de venta.
- Seleccion de cliente.
- Metodo de pago.
- Tipo de comprobante.
- Historial de ventas.
- Detalle de venta.

Endpoints/API frontend necesarios:

- `listSales`
- `getSale`
- `createSale`
- `listPaymentMethods`
- `listVoucherTypes`
- `searchProductsForSale`
- `searchCustomers`

### 3. Clientes

Tablas base:

- `clientes`
- `ventas`

Pantallas necesarias:

- Listado de clientes.
- Crear/editar cliente.
- Historial de compras por cliente.

Endpoints/API frontend necesarios:

- `listCustomers`
- `createCustomer`
- `updateCustomer`
- `updateCustomerStatus`
- `getCustomerSales`

### 4. Proveedores

Tablas base segun `fake_sql.sql`:

- `proveedores`
- `proveedor_categoria`
- `categorias`

Pantallas necesarias:

- Listado de proveedores.
- Crear/editar proveedor.
- Asignacion de categorias.

Nota de alineacion:

- El frontend declara "Proveedores y pedidos".
- El backend Prisma tiene `pedidos_proveedor` y `detalle_pedido_proveedor`.
- Esas tablas no existen en `fake_sql.sql`; si los pedidos se quedan en el alcance, se debe actualizar el SQL/documentacion base.

Endpoints/API frontend necesarios:

- `listSuppliers`
- `createSupplier`
- `updateSupplier`
- `updateSupplierStatus`
- `assignSupplierCategories`

### 5. Empleados, asistencias y boletas

Tablas base:

- `empleados`
- `asistencias_empleado`
- `boletas_pago_empleado`
- `detalle_boleta_pago`
- `usuarios`

Pantallas necesarias:

- Listado de empleados.
- Crear/editar empleado.
- Asistencias diarias.
- Cierre de asistencias abiertas.
- Generacion de boletas.
- Historial de boletas.

Endpoints/API frontend necesarios:

- `listEmployees`
- `createEmployee`
- `updateEmployee`
- `updateEmployeeStatus`
- `listAttendance`
- `markAttendance`
- `closeAttendance`
- `listPayrollSlips`
- `createPayrollSlip`

### 6. Perdidas

Tablas base:

- `perdidas_inventario`
- `motivos_perdida`
- `productos`
- `categorias`
- `proveedores`
- `empleados`
- `movimientos_inventario`

Pantallas necesarias:

- Registrar perdida.
- Historial de perdidas.
- Catalogo de motivos.
- Reporte de costo por periodo/producto/categoria.

Endpoints/API frontend necesarios:

- `listLosses`
- `createLoss`
- `listLossReasons`
- `createLossReason`

### 7. Reportes

Tablas base:

- `ventas`
- `detalle_venta`
- `productos`
- `clientes`
- `empleados`
- `perdidas_inventario`
- `movimientos_inventario`
- `boletas_pago_empleado`

Pantallas necesarias:

- Reporte de ventas.
- Reporte de inventario.
- Reporte de nomina.
- Reporte de perdidas.
- Exportacion.

Endpoints/API frontend necesarios:

- `getExecutiveDashboard`
- `getSalesReport`
- `getInventoryReport`
- `getPayrollReport`
- `getLossesReport`

## Desalineaciones detectadas

| Tema | Situacion actual | Recomendacion |
| --- | --- | --- |
| Dashboard | `DashboardView` usa arreglos mock (`kpis`, `salesTrend`, `moduleMix`, `ranking`) | Conectar con `GET /reports/dashboard/executive` o ajustar endpoint a lo que necesita la UI |
| Menu vs rutas | Hay rutas en `nav-items.ts` que no existen en `frontend/src/app` | Crear paginas placeholder funcionales o retirar enlaces hasta implementarlas |
| Permisos | `permissionModules` contiene modulos que no tienen ruta (`pedidos_proveedor`, `asistencias`, `salarios`, etc.) | Normalizar permisos por modulo/pantalla y documentar `module_key` oficiales |
| Proveedores y pedidos | Backend Prisma tiene pedidos de proveedor, pero `fake_sql.sql` no | Decidir si se agregan tablas de pedidos al SQL o se elimina del alcance frontend |
| Usuarios | Crear usuario no permite `employee_id` | Agregar selector de empleado o definir usuarios sin empleado como caso valido |
| Roles | Solo se listan roles para seleccion | Si se administran roles desde UI, falta CRUD de roles |
| Catalogos | `metodos_pago`, `tipos_comprobante`, `motivos_perdida` no tienen UI | Crear pantallas de catalogos o tratarlos como datos fijos |
| Inventario | No hay UI para productos, categorias, stock ni kardex | Prioridad alta porque muchas tablas dependen de productos |
| Ventas | No hay POS ni historial | Prioridad alta porque ventas conecta clientes, productos, empleados y comprobantes |

## Priorizacion sugerida

1. Conectar dashboard real:
   - Agregar `getExecutiveDashboard` en `frontend/src/lib/api.ts`.
   - Reemplazar datos mock en `DashboardView`.

2. Completar base operativa:
   - Inventario: categorias, productos, stock.
   - Clientes.
   - Empleados.

3. Construir operaciones principales:
   - POS/ventas.
   - Perdidas de inventario.
   - Movimientos/Kardex.

4. Cerrar administracion:
   - Vincular usuario con empleado.
   - Normalizar permisos.
   - Definir si roles son catalogo fijo o administrable.

5. Agregar reportes y nomina:
   - Reportes por ventas/inventario/perdidas.
   - Asistencias y boletas de pago.

## Estado por cobertura

| Area | Cobertura actual aproximada |
| --- | --- |
| Autenticacion | Alta |
| Usuarios y permisos | Media |
| Dashboard | Visual alto, datos reales bajo |
| Inventario | Baja |
| Ventas | Baja |
| Clientes | Baja |
| Proveedores | Baja |
| Empleados | Baja |
| Perdidas | Baja |
| Reportes | Baja |

