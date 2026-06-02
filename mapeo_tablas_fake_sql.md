# Mapeo de tablas de `fake_sql.sql`

Este documento resume las tablas definidas en `fake_sql.sql`, sus campos principales, claves y relaciones para apoyar la documentacion del sistema.

## Resumen general

- Motor objetivo: PostgreSQL.
- Extension usada: `pgcrypto`, para generar UUID con `gen_random_uuid()`.
- Total de tablas: 20.
- Patron general: la mayoria de tablas usa `id UUID` como clave primaria.

## Tablas

### 1. `roles`

Catalogo de roles del sistema.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `code` | VARCHAR(50) | Obligatorio, unico |
| `name` | VARCHAR(100) | Obligatorio |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

Datos iniciales:

- `admin`
- `empleado`

### 2. `empleados`

Registra la informacion laboral de los empleados.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `full_name` | VARCHAR(160) | Obligatorio |
| `dni` | VARCHAR(20) | Obligatorio, unico |
| `position` | VARCHAR(120) | Obligatorio |
| `phone` | VARCHAR(40) | Opcional |
| `hire_date` | DATE | Obligatorio |
| `daily_pay` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 3. `usuarios`

Usuarios que acceden al sistema.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `role_id` | UUID | FK a `roles(id)`, obligatorio |
| `employee_id` | UUID | FK a `empleados(id)`, opcional |
| `username` | VARCHAR(80) | Obligatorio, unico |
| `password_hash` | TEXT | Obligatorio |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |
| `last_access_at` | TIMESTAMPTZ | Opcional |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

Relaciones:

- Muchos usuarios pertenecen a un rol.
- Un usuario puede estar asociado a un empleado.

### 4. `user_permissions`

Permisos por modulo asignados a cada usuario.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `user_id` | UUID | FK a `usuarios(id)`, obligatorio, elimina en cascada |
| `module_key` | VARCHAR(50) | Obligatorio |
| `can_view` | BOOLEAN | Obligatorio, default `FALSE` |
| `can_create` | BOOLEAN | Obligatorio, default `FALSE` |
| `can_edit` | BOOLEAN | Obligatorio, default `FALSE` |
| `can_delete` | BOOLEAN | Obligatorio, default `FALSE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

Restricciones:

- `UNIQUE(user_id, module_key)`.

### 5. `categorias`

Catalogo de categorias de productos.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `name` | VARCHAR(120) | Obligatorio, unico |
| `slug` | VARCHAR(140) | Obligatorio, unico |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 6. `productos`

Productos disponibles en inventario y venta.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `category_id` | UUID | FK a `categorias(id)`, obligatorio |
| `name` | VARCHAR(180) | Obligatorio |
| `slug` | VARCHAR(220) | Obligatorio, unico |
| `unit_name` | VARCHAR(60) | Obligatorio |
| `stock` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `min_stock` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `sale_price` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `cost_price` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `icon_code` | VARCHAR(50) | Opcional |
| `description` | TEXT | Opcional |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 7. `imagenes_producto`

Imagenes asociadas a productos.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `product_id` | UUID | FK a `productos(id)`, obligatorio, elimina en cascada |
| `image_url` | TEXT | Obligatorio |
| `sort_order` | SMALLINT | Obligatorio, default `1`, entre 1 y 4 |
| `is_primary` | BOOLEAN | Obligatorio, default `FALSE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

Restricciones:

- `UNIQUE(product_id, sort_order)`.

### 8. `proveedores`

Proveedores del negocio.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `business_name` | VARCHAR(180) | Obligatorio |
| `ruc` | VARCHAR(20) | Obligatorio, unico |
| `contact_name` | VARCHAR(140) | Opcional |
| `phone` | VARCHAR(40) | Opcional |
| `email` | VARCHAR(160) | Opcional |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 9. `proveedor_categoria`

Tabla puente entre proveedores y categorias.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `supplier_id` | UUID | FK a `proveedores(id)`, obligatorio, elimina en cascada |
| `category_id` | UUID | FK a `categorias(id)`, obligatorio, elimina en cascada |

Restricciones:

- `UNIQUE(supplier_id, category_id)`.

### 10. `metodos_pago`

Catalogo de metodos de pago.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `code` | VARCHAR(50) | Obligatorio, unico |
| `name` | VARCHAR(100) | Obligatorio |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |

Datos iniciales:

- `efectivo`
- `yape`
- `plin`
- `tarjeta`
- `transferencia`

### 11. `tipos_comprobante`

Catalogo de comprobantes de venta.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `code` | VARCHAR(50) | Obligatorio, unico |
| `name` | VARCHAR(100) | Obligatorio |
| `series_prefix` | VARCHAR(20) | Opcional |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |

Datos iniciales:

- `boleta`
- `factura`
- `sin_comprobante`

### 12. `clientes`

Clientes registrados para ventas.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `document_type` | VARCHAR(20) | Obligatorio |
| `document_number` | VARCHAR(30) | Obligatorio |
| `name` | VARCHAR(180) | Obligatorio |
| `address` | VARCHAR(220) | Opcional |
| `phone` | VARCHAR(40) | Opcional |
| `email` | VARCHAR(160) | Opcional |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

Restricciones:

- `UNIQUE(document_type, document_number)`.

### 13. `ventas`

Cabecera de ventas realizadas.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `serie` | VARCHAR(40) | Obligatorio, unico |
| `voucher_type_id` | UUID | FK a `tipos_comprobante(id)`, obligatorio |
| `payment_method_id` | UUID | FK a `metodos_pago(id)`, obligatorio |
| `client_id` | UUID | FK a `clientes(id)`, opcional |
| `employee_id` | UUID | FK a `empleados(id)`, obligatorio |
| `sale_date` | DATE | Obligatorio |
| `sale_time` | TIME | Obligatorio |
| `subtotal` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `discount_pct` | NUMERIC(5,2) | Obligatorio, default `0`, debe ser >= 0 |
| `discount_amount` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `total` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `note` | TEXT | Opcional |
| `amount_received` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `change_amount` | NUMERIC(12,2) | Obligatorio, default `0` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 14. `detalle_venta`

Detalle de productos vendidos en cada venta.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `sale_id` | UUID | FK a `ventas(id)`, obligatorio, elimina en cascada |
| `product_id` | UUID | FK a `productos(id)`, obligatorio |
| `product_name_snapshot` | VARCHAR(180) | Obligatorio, nombre historico del producto |
| `quantity` | NUMERIC(12,2) | Obligatorio, debe ser > 0 |
| `unit_price` | NUMERIC(12,2) | Obligatorio, debe ser >= 0 |
| `line_total` | NUMERIC(12,2) | Obligatorio, debe ser >= 0 |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 15. `asistencias_empleado`

Registro de asistencias por empleado y fecha.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `employee_id` | UUID | FK a `empleados(id)`, obligatorio, elimina en cascada |
| `work_date` | DATE | Obligatorio |
| `check_in_time` | TIME | Opcional |
| `check_out_time` | TIME | Opcional |
| `status` | VARCHAR(30) | Obligatorio: `asistio`, `falto`, `en_turno`, `pendiente` |
| `source` | VARCHAR(30) | Obligatorio, default `manual`: `manual`, `auto_close`, `system` |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |
| `updated_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

Restricciones:

- `UNIQUE(employee_id, work_date)`.

### 16. `motivos_perdida`

Catalogo de motivos de perdida de inventario.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `name` | VARCHAR(100) | Obligatorio, unico |
| `active` | BOOLEAN | Obligatorio, default `TRUE` |

Datos iniciales:

- `rotura`
- `faltante`
- `humedad`
- `merma`
- `dano_transporte`
- `ajuste_inventario`

### 17. `perdidas_inventario`

Registra perdidas, mermas o ajustes negativos de inventario.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `product_id` | UUID | FK a `productos(id)`, obligatorio |
| `category_id` | UUID | FK a `categorias(id)`, obligatorio |
| `supplier_id` | UUID | FK a `proveedores(id)`, opcional |
| `employee_id` | UUID | FK a `empleados(id)`, opcional |
| `loss_reason_id` | UUID | FK a `motivos_perdida(id)`, obligatorio |
| `quantity` | NUMERIC(12,2) | Obligatorio, debe ser > 0 |
| `unit_cost` | NUMERIC(12,2) | Obligatorio, debe ser >= 0 |
| `total_cost` | NUMERIC(12,2) | Obligatorio, debe ser >= 0 |
| `loss_date` | DATE | Obligatorio |
| `loss_time` | TIME | Obligatorio |
| `note` | TEXT | Opcional |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 18. `boletas_pago_empleado`

Cabecera de boletas de pago de empleados.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `slip_number` | VARCHAR(40) | Obligatorio, unico |
| `employee_id` | UUID | FK a `empleados(id)`, obligatorio |
| `period_year` | INTEGER | Obligatorio, debe ser >= 2000 |
| `period_month` | INTEGER | Obligatorio, entre 1 y 12 |
| `issue_date` | DATE | Obligatorio |
| `days_worked` | INTEGER | Obligatorio, default `0`, debe ser >= 0 |
| `daily_pay` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `subtotal` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `discounts` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `net_total` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |
| `created_by_user_id` | UUID | FK a `usuarios(id)`, opcional |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

### 19. `detalle_boleta_pago`

Detalle de dias considerados en una boleta de pago.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `payroll_slip_id` | UUID | FK a `boletas_pago_empleado(id)`, obligatorio, elimina en cascada |
| `work_date` | DATE | Obligatorio |
| `check_in_time` | TIME | Opcional |
| `check_out_time` | TIME | Opcional |
| `amount` | NUMERIC(12,2) | Obligatorio, default `0`, debe ser >= 0 |

### 20. `movimientos_inventario`

Historial de movimientos de stock.

| Campo | Tipo | Restricciones / descripcion |
| --- | --- | --- |
| `id` | UUID | PK, default `gen_random_uuid()` |
| `product_id` | UUID | FK a `productos(id)`, obligatorio |
| `movement_type` | VARCHAR(30) | Obligatorio: `sale_out`, `manual_in`, `manual_out`, `loss_out`, `adjustment` |
| `reference_type` | VARCHAR(40) | Opcional |
| `reference_id` | UUID | Opcional |
| `quantity` | NUMERIC(12,2) | Obligatorio, debe ser > 0 |
| `unit_cost` | NUMERIC(12,2) | Opcional, si existe debe ser >= 0 |
| `note` | TEXT | Opcional |
| `created_by_user_id` | UUID | FK a `usuarios(id)`, opcional |
| `created_at` | TIMESTAMPTZ | Obligatorio, default `NOW()` |

## Relaciones principales

| Origen | Campo | Destino | Tipo |
| --- | --- | --- | --- |
| `usuarios` | `role_id` | `roles(id)` | Muchos a uno |
| `usuarios` | `employee_id` | `empleados(id)` | Muchos a uno opcional |
| `user_permissions` | `user_id` | `usuarios(id)` | Muchos a uno, cascada |
| `productos` | `category_id` | `categorias(id)` | Muchos a uno |
| `imagenes_producto` | `product_id` | `productos(id)` | Muchos a uno, cascada |
| `proveedor_categoria` | `supplier_id` | `proveedores(id)` | Muchos a uno, cascada |
| `proveedor_categoria` | `category_id` | `categorias(id)` | Muchos a uno, cascada |
| `ventas` | `voucher_type_id` | `tipos_comprobante(id)` | Muchos a uno |
| `ventas` | `payment_method_id` | `metodos_pago(id)` | Muchos a uno |
| `ventas` | `client_id` | `clientes(id)` | Muchos a uno opcional |
| `ventas` | `employee_id` | `empleados(id)` | Muchos a uno |
| `detalle_venta` | `sale_id` | `ventas(id)` | Muchos a uno, cascada |
| `detalle_venta` | `product_id` | `productos(id)` | Muchos a uno |
| `asistencias_empleado` | `employee_id` | `empleados(id)` | Muchos a uno, cascada |
| `perdidas_inventario` | `product_id` | `productos(id)` | Muchos a uno |
| `perdidas_inventario` | `category_id` | `categorias(id)` | Muchos a uno |
| `perdidas_inventario` | `supplier_id` | `proveedores(id)` | Muchos a uno opcional |
| `perdidas_inventario` | `employee_id` | `empleados(id)` | Muchos a uno opcional |
| `perdidas_inventario` | `loss_reason_id` | `motivos_perdida(id)` | Muchos a uno |
| `boletas_pago_empleado` | `employee_id` | `empleados(id)` | Muchos a uno |
| `boletas_pago_empleado` | `created_by_user_id` | `usuarios(id)` | Muchos a uno opcional |
| `detalle_boleta_pago` | `payroll_slip_id` | `boletas_pago_empleado(id)` | Muchos a uno, cascada |
| `movimientos_inventario` | `product_id` | `productos(id)` | Muchos a uno |
| `movimientos_inventario` | `created_by_user_id` | `usuarios(id)` | Muchos a uno opcional |

## Indices definidos

| Indice | Tabla / campos |
| --- | --- |
| `idx_usuarios_role_id` | `usuarios(role_id)` |
| `idx_usuarios_employee_id` | `usuarios(employee_id)` |
| `idx_user_permissions_user_id` | `user_permissions(user_id)` |
| `idx_productos_category_active` | `productos(category_id, active)` |
| `idx_imagenes_producto_product_id` | `imagenes_producto(product_id)` |
| `idx_clientes_name` | `clientes(name)` |
| `idx_ventas_created_at` | `ventas(created_at)` |
| `idx_ventas_employee_created_at` | `ventas(employee_id, created_at)` |
| `idx_ventas_client_created_at` | `ventas(client_id, created_at)` |
| `idx_detalle_venta_product_id` | `detalle_venta(product_id)` |
| `idx_asistencias_empleado_work_date` | `asistencias_empleado(work_date)` |
| `idx_perdidas_inventario_loss_date` | `perdidas_inventario(loss_date)` |
| `idx_boletas_pago_empleado_employee_period` | `boletas_pago_empleado(employee_id, period_year, period_month)` |
| `idx_movimientos_inventario_product_created_at` | `movimientos_inventario(product_id, created_at)` |

## Modulos funcionales sugeridos

| Modulo | Tablas relacionadas |
| --- | --- |
| Seguridad y acceso | `roles`, `usuarios`, `user_permissions` |
| Personal | `empleados`, `asistencias_empleado`, `boletas_pago_empleado`, `detalle_boleta_pago` |
| Catalogos comerciales | `categorias`, `productos`, `imagenes_producto`, `proveedores`, `proveedor_categoria` |
| Ventas | `clientes`, `ventas`, `detalle_venta`, `metodos_pago`, `tipos_comprobante` |
| Inventario | `movimientos_inventario`, `perdidas_inventario`, `motivos_perdida`, `productos`, `categorias`, `proveedores` |
