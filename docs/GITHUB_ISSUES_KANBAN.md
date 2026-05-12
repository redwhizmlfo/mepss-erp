# Gestion de Issues, Checks y Kanban en GitHub

Este documento define como vamos a trabajar el proyecto en GitHub a medida que se implemente el ERP con Next.js, React, CSS, Node.js, Prisma y PostgreSQL.

Objetivo:

- Convertir cada actividad en un Issue claro.
- Descomponer cada Issue en checks internos ejecutables.
- Usar milestones/sprints para organizar el avance.
- Usar etiquetas para tipo, prioridad, estado y modulo.
- Mantener trazabilidad entre Issue, rama, Pull Request y cierre.

## 1. Flujo de vida de un Issue

Secuencia recomendada:

```txt
Idea / necesidad
-> Crear Issue en GitHub
-> Etiquetar tipo, prioridad y modulo
-> Asignar responsable
-> Asignar sprint / milestone
-> Mover en tablero Kanban
-> Crear rama de trabajo
-> Implementar checks
-> Crear Pull Request
-> Code Review / QA
-> Merge
-> Done / Closed
```

Estados Kanban:

- `Backlog`: idea o actividad pendiente.
- `To Do`: actividad lista para comenzar en el sprint.
- `In Progress`: actividad en desarrollo.
- `Code Review`: Pull Request abierto y en revision.
- `QA`: validacion funcional o visual.
- `Done`: terminado, probado y documentado.

## 2. Labels recomendados

Tipo:

- `type: historia`
- `type: tarea`
- `type: bug`
- `type: documentacion`
- `type: mejora`

Prioridad:

- `priority: alta`
- `priority: media`
- `priority: baja`

Modulo:

- `module: dashboard`
- `module: ventas`
- `module: inventario`
- `module: proveedores`
- `module: empleados`
- `module: clientes`
- `module: perdidas`
- `module: reportes`
- `module: admin`
- `module: backend`
- `module: frontend`
- `module: db`

Estado:

- `status: backlog`
- `status: todo`
- `status: in-progress`
- `status: code-review`
- `status: qa`
- `status: done`

## 3. Milestones / Sprints

Duracion sugerida del proyecto: 90 dias.

- `Sprint 1 - Base del proyecto`: monorepo, base de datos, Prisma, layout, navbar, dashboard inicial.
- `Sprint 2 - Seguridad y administracion`: login, JWT, usuarios, roles, permisos.
- `Sprint 3 - Catalogo e inventario`: categorias, productos, imagenes, stock, kardex.
- `Sprint 4 - Ventas y proveedores`: POS, ventas transaccionales, pedidos a proveedor, recepcion.
- `Sprint 5 - Empleados y pagos`: empleados, asistencias, salarios, boletas.
- `Sprint 6 - Reportes y cierre`: graficos avanzados, QA, responsive, documentacion y despliegue.

## 4. Listado inicial de Issues del proyecto

### Issue #1: Crear base monorepo Next.js + Node.js + Prisma

Tipo: Tarea  
Prioridad: Alta  
Estado: In Progress  
Sprint: Sprint 1  
Responsable: Por asignar  
Duracion: 2 dias

Descripcion:

Crear la estructura base del proyecto con frontend Next.js, backend Node.js/Express, Prisma y PostgreSQL.

Checklist:

- Crear `package.json` raiz con workspaces.
- Crear carpeta `frontend`.
- Crear carpeta `backend`.
- Configurar TypeScript en frontend y backend.
- Configurar Next.js App Router.
- Configurar Express.
- Configurar Prisma.
- Copiar SQL inicial como migracion.
- Crear Docker Compose para PostgreSQL.
- Crear README con comandos iniciales.
- Ejecutar build de frontend.
- Ejecutar build de backend.

Criterios de aceptacion:

- El proyecto instala dependencias con `npm install`.
- El frontend compila.
- El backend compila.
- Prisma genera cliente correctamente.
- La documentacion indica como arrancar el proyecto.

### Issue #2: Mapear base de datos con Prisma

Tipo: Tarea  
Prioridad: Alta  
Estado: To Do  
Sprint: Sprint 1  
Responsable: Por asignar  
Duracion: 3 dias

Descripcion:

Mapear todas las tablas del SQL en `schema.prisma` respetando nombres reales, relaciones, indices y restricciones principales.

Checklist:

- Mapear roles.
- Mapear usuarios y permisos.
- Mapear empleados.
- Mapear categorias y productos.
- Mapear imagenes de producto.
- Mapear proveedores y categorias por proveedor.
- Mapear pedidos a proveedor.
- Mapear clientes.
- Mapear ventas y detalle.
- Mapear inventario y movimientos.
- Mapear perdidas.
- Mapear asistencias.
- Mapear boletas de pago.
- Ejecutar `prisma generate`.
- Validar nombres con `@@map` y `@map`.

Criterios de aceptacion:

- Prisma genera el cliente sin errores.
- Las relaciones principales estan declaradas.
- El modelo respeta la base PostgreSQL existente.

### Issue #3: Crear navbar/sidebar de modulos

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: To Do  
Sprint: Sprint 1  
Responsable: Por asignar  
Duracion: 2 dias

Descripcion:

Crear la navegacion principal del ERP con modulos y submodulos para Dashboard, Ventas, Inventario, Proveedores, Clientes, Empleados, Perdidas, Reportes y Administracion.

Checklist:

- Definir `navItems`.
- Crear componente `AppShell`.
- Crear sidebar fijo en desktop.
- Crear version responsive.
- Agregar iconos Lucide.
- Mostrar usuario activo.
- Agregar busqueda global visual.
- Agregar acceso rapido a alertas.
- Conectar rutas principales.
- Preparar validacion futura por permisos.

Criterios de aceptacion:

- El navbar muestra todos los modulos definidos.
- La UI es responsive.
- La navegacion respeta la direccion visual luxury.

### Issue #4: Crear dashboard ejecutivo avanzado

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: To Do  
Sprint: Sprint 1  
Responsable: Por asignar  
Duracion: 4 dias

Descripcion:

Crear el dashboard principal con KPIs, graficos, rankings, alertas e insights de los modulos principales.

Checklist:

- Crear metric cards.
- Crear grafico de ventas vs perdidas.
- Crear grafico de actividad por hora.
- Crear grafico de distribucion por modulo.
- Crear ranking de productos.
- Crear alert strip.
- Agregar filtros de periodo.
- Crear estados vacios.
- Conectar contrato con endpoint backend.
- Validar responsive.
- Validar build de Next.js.

Criterios de aceptacion:

- El dashboard se visualiza como primera pantalla.
- Los graficos renderizan correctamente.
- Los KPIs son claros y accionables.
- El diseño mantiene estilo luxury.

### Issue #5: Crear endpoints base de dashboard

Tipo: Tarea  
Prioridad: Alta  
Estado: To Do  
Sprint: Sprint 1  
Responsable: Por asignar  
Duracion: 2 dias

Descripcion:

Crear endpoints agregados para alimentar el dashboard desde el backend.

Checklist:

- Crear router de reportes.
- Crear endpoint `/api/v1/reports/dashboard/executive`.
- Agregar conteo de productos.
- Agregar conteo de stock critico.
- Agregar conteo de empleados.
- Agregar conteo de clientes.
- Agregar conteo de proveedores.
- Agregar conteo de pedidos pendientes.
- Agregar alertas operativas.
- Manejar errores de Prisma.
- Probar endpoint con navegador o cliente HTTP.

Criterios de aceptacion:

- El endpoint responde JSON valido.
- El endpoint no rompe si no hay datos.
- El backend compila.

### Issue #6: Implementar autenticacion JWT

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: In Progress  
Sprint: Sprint 2  
Responsable: Por asignar  
Duracion: 4 dias

Descripcion:

Permitir inicio de sesion seguro para usuarios registrados y proteger rutas del backend.

Checklist:

- [x] Crear modulo `auth`.
- [x] Crear endpoint login.
- [x] Validar usuario y password.
- [x] Agregar hash con bcrypt.
- [x] Generar JWT.
- [x] Crear middleware de autenticacion.
- [x] Crear endpoint `/auth/me`.
- [x] Manejar usuario inactivo.
- [x] Probar login valido.
- [x] Probar login invalido.
- [x] Documentar variables de entorno.
- [x] Crear seed de admin local.
- [x] Proteger dashboard por token.
- [x] Crear UI de login.
- [x] Persistir token en frontend.
- [x] Crear logout.

Criterios de aceptacion:

- El login devuelve token.
- Las rutas protegidas rechazan requests sin token.
- No se exponen contrasenas.

### Issue #7: Implementar permisos por modulo

Tipo: Tarea  
Prioridad: Alta  
Estado: In Progress  
Sprint: Sprint 2  
Responsable: Por asignar  
Duracion: 3 dias

Descripcion:

Implementar validacion de permisos usando `user_permissions` y `module_key`.

Checklist:

- [x] Definir claves de modulos.
- [x] Crear middleware `requirePermission`.
- [x] Validar `can_view`.
- [x] Validar `can_create`.
- [x] Validar `can_edit`.
- [x] Validar `can_delete`.
- [x] Crear endpoint para reemplazar permisos.
- [x] Crear seed de permisos admin.
- [x] Crear helper frontend para ocultar modulos.
- [x] Probar usuario admin.
- [ ] Probar usuario empleado desde login.
- [x] Documentar permisos iniciales.

### Issue #14: Crear administracion backend de usuarios

Tipo: Tarea  
Prioridad: Alta  
Estado: In Progress  
Sprint: Sprint 2  
Responsable: Por asignar  
Duracion: 3 dias

Descripcion:

Crear endpoints protegidos para administrar usuarios, roles y permisos desde el backend.

Checklist:

- [x] Crear modulo `users`.
- [x] Crear endpoint de roles.
- [x] Crear endpoint de listado de usuarios.
- [x] Crear endpoint de detalle de usuario.
- [x] Crear endpoint de creacion de usuario.
- [x] Crear endpoint de actualizacion de usuario.
- [x] Crear endpoint de activacion/desactivacion.
- [x] Crear endpoint de reemplazo de permisos.
- [x] Proteger rutas con JWT.
- [x] Proteger rutas con permisos.
- [x] Probar acceso sin token.
- [x] Probar flujo con admin.

Criterios de aceptacion:

- [x] Admin puede crear usuarios.
- [x] Admin puede listar roles y usuarios.
- [x] Admin puede cambiar estado de usuario.
- [x] Admin puede reemplazar permisos.
- [x] Requests sin token devuelven `401`.

### Issue #15: Crear administracion frontend de usuarios

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: In Progress  
Sprint: Sprint 2  
Responsable: Por asignar  
Duracion: 3 dias

Descripcion:

Crear la pantalla inicial de administracion de usuarios en el frontend, conectada a los endpoints protegidos del backend.

Checklist:

- [x] Crear `AuthGate` reutilizable.
- [x] Crear ruta `/admin/users`.
- [x] Crear vista `AdminUsersView`.
- [x] Consumir listado de usuarios.
- [x] Consumir listado de roles.
- [x] Crear formulario rapido de usuario.
- [x] Crear tabla de usuarios.
- [x] Mostrar rol, estado y permisos.
- [x] Activar/desactivar usuario desde UI.
- [x] Filtrar navbar por permisos.
- [x] Crear editor detallado de permisos.
- [x] Guardar permisos desde frontend.
- [x] Probar endpoint de permisos con token admin.
- [x] Validar build frontend.

Criterios de aceptacion:

- [x] La ruta `/admin/users` responde en Next.js.
- [x] Usuario admin puede ver la pantalla.
- [x] La UI mantiene el estilo luxury administrativo.
- [x] El build de frontend pasa.
- [x] El editor permite marcar Ver, Crear, Editar y Borrar por modulo.

Criterios de aceptacion:

- Backend valida permisos.
- Frontend oculta acciones sin permiso.
- El flujo no depende solo del frontend.

### Issue #8: Crear CRUD de productos e inventario

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: Backlog  
Sprint: Sprint 3  
Responsable: Por asignar  
Duracion: 5 dias

Descripcion:

Gestionar productos, categorias, stock minimo, precios e imagenes.

Checklist:

- Crear endpoints de categorias.
- Crear endpoints de productos.
- Crear validaciones con Zod.
- Crear listado con filtros.
- Crear formulario de producto.
- Crear estado activo/inactivo.
- Mostrar stock actual.
- Mostrar alerta de stock minimo.
- Agregar imagenes de producto.
- Probar creacion.
- Probar edicion.
- Probar desactivacion.

Criterios de aceptacion:

- Se pueden crear y editar productos.
- El stock minimo genera alerta.
- La UI es responsive.

### Issue #9: Crear POS y ventas transaccionales

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: Backlog  
Sprint: Sprint 4  
Responsable: Por asignar  
Duracion: 6 dias

Descripcion:

Crear punto de venta con carrito, descuento, comprobante, metodo de pago y descuento automatico de inventario.

Checklist:

- Crear pantalla POS.
- Crear buscador de productos.
- Agregar producto al carrito.
- Editar cantidad.
- Eliminar producto.
- Calcular subtotal.
- Calcular descuento.
- Calcular total.
- Validar stock disponible.
- Crear venta en transaccion Prisma.
- Crear detalle de venta.
- Descontar stock.
- Crear movimiento `sale_out`.
- Probar venta exitosa.
- Probar venta sin stock.

Criterios de aceptacion:

- La venta afecta inventario correctamente.
- No se permite vender sin stock.
- El flujo POS es rapido y claro.

### Issue #10: Crear pedidos a proveedor y recepcion

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: Backlog  
Sprint: Sprint 4  
Responsable: Por asignar  
Duracion: 5 dias

Descripcion:

Permitir crear pedidos a proveedor y recibirlos para aumentar inventario.

Checklist:

- Crear CRUD de proveedores.
- Crear pedido a proveedor.
- Agregar detalle de productos.
- Calcular subtotal y total.
- Cambiar estado a enviado.
- Crear recepcion de pedido.
- Aumentar stock al recibir.
- Crear movimiento de inventario.
- Evitar doble recepcion.
- Listar pedidos pendientes.
- Probar pedido recibido.
- Probar pedido cancelado.

Criterios de aceptacion:

- Proveedores no se mezclan con ventas.
- La recepcion aumenta stock.
- Cada recepcion queda trazada.

### Issue #11: Crear modulo empleados, asistencia y salarios

Tipo: Historia de usuario  
Prioridad: Alta  
Estado: Backlog  
Sprint: Sprint 5  
Responsable: Por asignar  
Duracion: 6 dias

Descripcion:

Gestionar empleados, asistencias, salario diario y boletas de pago.

Checklist:

- Crear CRUD de empleados.
- Crear entrada de asistencia.
- Crear salida de asistencia.
- Registrar falta.
- Ver calendario mensual.
- Calcular dias trabajados.
- Calcular subtotal de pago.
- Aplicar descuentos.
- Generar boleta.
- Crear detalle de boleta.
- Probar asistencia completa.
- Probar boleta por periodo.

Criterios de aceptacion:

- Asistencia y salario estan dentro del modulo empleados.
- La boleta se calcula desde asistencias.
- Ventas no controla salarios.

### Issue #12: Crear reportes avanzados

Tipo: Historia de usuario  
Prioridad: Media  
Estado: Backlog  
Sprint: Sprint 6  
Responsable: Por asignar  
Duracion: 5 dias

Descripcion:

Crear reportes cruzados de ventas, inventario, proveedores, empleados, clientes y perdidas.

Checklist:

- Reporte de ventas por rango.
- Reporte de ventas por empleado.
- Reporte de ventas por cliente.
- Reporte de productos mas vendidos.
- Reporte de stock critico.
- Reporte de pedidos a proveedor.
- Reporte de asistencias.
- Reporte de boletas.
- Reporte de perdidas por motivo.
- Exportar datos a CSV.
- Validar filtros.
- Validar permisos.

Criterios de aceptacion:

- Los reportes cargan con filtros.
- Los resultados coinciden con la base.
- Se pueden exportar datos principales.

### Issue #13: Testing funcional del flujo principal

Tipo: Tarea  
Prioridad: Media  
Estado: Backlog  
Sprint: Sprint 6  
Responsable: Por asignar  
Duracion: 4 dias

Descripcion:

Probar los flujos principales antes del cierre funcional.

Checklist:

- Probar login.
- Probar permisos.
- Probar CRUD de productos.
- Probar POS.
- Probar descuento de stock.
- Probar pedido a proveedor.
- Probar recepcion de pedido.
- Probar asistencia.
- Probar boleta.
- Probar dashboard.
- Registrar bugs encontrados.
- Cerrar bugs criticos.

Criterios de aceptacion:

- Los flujos principales no presentan errores criticos.
- Los bugs encontrados tienen Issue.
- La app compila despues de correcciones.

## 5. Plantilla general para cada Issue

```md
## Tipo

Historia de usuario / Tarea / Bug / Documentacion / Mejora

## Prioridad

Alta / Media / Baja

## Sprint / Milestone

Sprint X - Nombre del sprint

## Responsable

@usuario

## Fecha de inicio

AAAA-MM-DD

## Duracion estimada

X dias

## Descripcion

Explicar brevemente que se debe desarrollar, corregir o documentar.

## Checklist

- [ ] Actividad 1
- [ ] Actividad 2
- [ ] Actividad 3
- [ ] Actividad 4
- [ ] Actividad 5

## Criterios de aceptacion

- [ ] El trabajo cumple el requerimiento definido.
- [ ] El codigo fue probado localmente.
- [ ] No genera errores en funcionalidades existentes.
- [ ] Se actualizo la documentacion si corresponde.
- [ ] Se creo Pull Request para revision.
```

## 6. Convencion de ramas

Ramas sugeridas:

- `main`: version estable.
- `develop`: integracion de desarrollo si se decide usar GitFlow completo.
- `feature/issue-4-dashboard-avanzado`
- `bugfix/issue-12-login`
- `docs/issue-3-modelo-er`
- `test/issue-13-flujos-principales`

Convencion:

```txt
feature/issue-{numero}-{descripcion-corta}
bugfix/issue-{numero}-{descripcion-corta}
docs/issue-{numero}-{descripcion-corta}
```

## 7. Convencion de commits

Formato recomendado:

```txt
tipo(scope): descripcion corta
```

Ejemplos:

- `feat(dashboard): agrega metricas ejecutivas`
- `feat(inventory): crea kardex de producto`
- `fix(auth): corrige validacion de token`
- `docs(github): documenta flujo de issues`
- `test(sales): cubre venta sin stock`

## 8. Resultado esperado en GitHub

Cada Issue debe tener:

| Elemento | Utilidad |
| --- | --- |
| Descripcion | Explica que se debe hacer |
| Checklist | Divide el trabajo en actividades pequenas |
| Responsable | Define quien ejecuta el trabajo |
| Sprint / Milestone | Ubica el trabajo temporalmente |
| Prioridad | Ayuda a ordenar el trabajo |
| Estado | Permite moverlo en el tablero Kanban |
| Criterios de aceptacion | Define cuando se considera terminado |

## 9. Regla de mantenimiento

A medida que se implemente el proyecto:

- Cada mejora nueva debe tener Issue.
- Cada Issue debe tener checklist actualizado.
- Cada PR debe mencionar el Issue relacionado.
- Cada modulo terminado debe actualizar la documentacion en `docs/`.
- El tablero Kanban debe reflejar el estado real del trabajo.
- Cada avance debe terminar con commit y push sincronizado a GitHub.
- Las referencias visuales del flujo estan documentadas en `docs/REFERENCIAS_VISUALES_GITHUB.md`.
- El protocolo operativo de sincronizacion esta en `docs/PROTOCOLO_SINCRONIZACION_GITHUB.md`.
