# Arquitectura Frontend y Backend del Proyecto

## Proyecto

El proyecto **MEPSS ERP** esta organizado bajo una arquitectura cliente-servidor. El frontend se encarga de mostrar la interfaz grafica al usuario y el backend se encarga de procesar la logica del negocio, validar datos, proteger rutas y comunicarse con la base de datos.

La arquitectura general se divide en tres capas principales:

| Capa | Tecnologia | Responsabilidad |
|---|---|---|
| Frontend | Next.js, React, TypeScript | Interfaz de usuario, vistas, formularios, navegacion y consumo de API. |
| Backend | Node.js, Express, TypeScript | API REST, autenticacion, reglas de negocio, validaciones y seguridad. |
| Base de datos | PostgreSQL, Prisma ORM | Persistencia de usuarios, productos, ventas, clientes, empleados y reportes. |

---

## Arquitectura General

El flujo principal del sistema funciona de la siguiente manera:

```txt
Usuario
  |
  v
Frontend Next.js
  |
  v
API REST Backend Express
  |
  v
Prisma ORM
  |
  v
Base de datos PostgreSQL
```

El usuario interactua con las pantallas del sistema desde el navegador. El frontend envia peticiones HTTP al backend mediante funciones centralizadas en `frontend/src/lib/api.ts`. Luego, el backend procesa la solicitud, valida permisos y utiliza Prisma para leer o guardar informacion en PostgreSQL.

---

# Arquitectura Frontend

## Tecnologia Principal

El frontend esta construido con:

- **Next.js:** framework principal para construir la aplicacion web.
- **React:** biblioteca para crear componentes visuales.
- **TypeScript:** lenguaje usado para tipar datos, funciones y propiedades.
- **Lucide React:** biblioteca de iconos.
- **Recharts:** biblioteca para graficos y reportes.

Archivo de configuracion principal:

```txt
frontend/package.json
```

---

## Estructura del Frontend

La estructura principal del frontend se organiza de esta forma:

```txt
frontend/src
  app/
    page.tsx
    layout.tsx
    sales/
    customers/
    employees/
    inventory/
    admin/
  components/
    layout/
  features/
    auth/
    sales/
    customers/
    employees/
    dashboard/
    admin-users/
  lib/
    api.ts
  styles/
    globals.css
    modules.css
    sales.css
    inventory.css
```

Esta division permite separar las rutas de la aplicacion, los componentes reutilizables, las vistas funcionales y los estilos.

---

## Capa de Paginas

La carpeta `frontend/src/app` contiene las rutas principales del sistema. Cada carpeta representa una pantalla o modulo del ERP.

Ejemplos:

| Ruta | Funcion |
|---|---|
| `frontend/src/app/page.tsx` | Pagina principal del sistema. |
| `frontend/src/app/sales/pos/page.tsx` | Pantalla del punto de venta. |
| `frontend/src/app/sales/history/page.tsx` | Historial de ventas. |
| `frontend/src/app/customers/page.tsx` | Modulo de clientes. |
| `frontend/src/app/employees/page.tsx` | Modulo de empleados. |
| `frontend/src/app/inventory/products/page.tsx` | Modulo de inventario. |
| `frontend/src/app/admin/users/page.tsx` | Administracion de usuarios. |

Estas paginas sirven como punto de entrada visual para cada modulo.

---

## Capa de Componentes y Vistas

La carpeta `frontend/src/features` contiene las vistas principales de cada modulo. Estas vistas manejan formularios, tablas, busquedas, estados de carga y comunicacion con la API.

Ejemplos:

| Modulo | Archivo principal |
|---|---|
| Autenticacion | `frontend/src/features/auth/LoginView.tsx` |
| Ventas POS | `frontend/src/features/sales/SalesPosView.tsx` |
| Historial de ventas | `frontend/src/features/sales/SalesHistoryView.tsx` |
| Clientes | `frontend/src/features/customers/CustomersView.tsx` |
| Empleados | `frontend/src/features/employees/EmployeesView.tsx` |
| Boletas | `frontend/src/features/employees/PayrollView.tsx` |
| Dashboard | `frontend/src/features/dashboard/DashboardView.tsx` |
| Usuarios | `frontend/src/features/admin-users/AdminUsersView.tsx` |

Estas vistas representan la parte interactiva del sistema.

---

## Capa de Comunicacion con API

El archivo `frontend/src/lib/api.ts` centraliza la comunicacion entre frontend y backend.

En este archivo se define la URL base de la API:

```ts
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://mepss-erp-api.onrender.com/api/v1"
    : "http://localhost:4000/api/v1");
```

Tambien contiene funciones para consumir los endpoints:

```ts
export function login(username: string, password: string)
export function getMe(token: string)
export function listUsers(token: string)
export function listProducts(token: string)
export function createSale(token: string, payload: CreateSalePayload)
export function listCustomers(token: string, query?: string)
export function listEmployees(token: string, query?: string)
```

Esto permite que las pantallas no llamen directamente a URLs sueltas, sino que usen funciones organizadas y reutilizables.

---

## Manejo de Estado en Frontend

El frontend utiliza estados de React para controlar la informacion visible en pantalla.

Ejemplo en el modulo POS:

```ts
const [cart, setCart] = useState<CartLine[]>([]);
const [search, setSearch] = useState("");
const [amountReceived, setAmountReceived] = useState("");
```

Estos estados permiten controlar:

- Productos seleccionados en el carrito.
- Busqueda de productos.
- Cliente seleccionado.
- Metodo de pago.
- Tipo de comprobante.
- Total de venta.
- Mensajes de error o confirmacion.

---

## Ejemplo de Calculo en Frontend

En el modulo de ventas POS se calcula el subtotal, total y vuelto antes de confirmar la venta.

Archivo:

```txt
frontend/src/features/sales/SalesPosView.tsx
```

Ejemplo:

```ts
const subtotal = cart.reduce((s, l) => s + l.quantity * Number(l.product.salePrice), 0);
const total = subtotal;
const received = parseFloat(amountReceived) || 0;
const change = received >= total ? received - total : null;
```

Este calculo mejora la experiencia del usuario porque permite ver el monto a cobrar y el vuelto estimado antes de registrar la venta.

---

# Arquitectura Backend

## Tecnologia Principal

El backend esta construido con:

- **Node.js:** entorno de ejecucion del servidor.
- **Express:** framework para construir la API REST.
- **TypeScript:** tipado del codigo backend.
- **Prisma ORM:** comunicacion con la base de datos PostgreSQL.
- **Zod:** validacion de datos de entrada.
- **JWT:** autenticacion mediante tokens.
- **bcryptjs:** cifrado de contrasenas.
- **Helmet y CORS:** seguridad para la API.

Archivo de configuracion principal:

```txt
backend/package.json
```

---

## Estructura del Backend

La estructura principal del backend se organiza asi:

```txt
backend/src
  app.ts
  server.ts
  config/
    env.ts
  modules/
    auth/
    users/
    inventory/
    sales/
    customers/
    employees/
    reports/
  shared/
    async-handler.ts
    auth-middleware.ts
    http-error.ts
    prisma.ts
```

Esta organizacion permite separar la configuracion general, los modulos funcionales y los recursos compartidos.

---

## Archivo Principal de la API

El archivo `backend/src/app.ts` configura la aplicacion Express.

Responsabilidades principales:

- Activar seguridad con `helmet`.
- Configurar CORS.
- Permitir recepcion de JSON.
- Registrar logs con `morgan`.
- Definir ruta de salud `/api/v1/health`.
- Montar las rutas principales del sistema.
- Manejar errores globales.

Rutas principales registradas:

```ts
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/sales", salesRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/employees", employeesRouter);
app.use("/api/v1/reports/dashboard", authenticate, requirePermission("dashboard"), dashboardRouter);
```

---

## Modulos del Backend

Cada modulo agrupa rutas y logica relacionada con una funcionalidad del sistema.

| Modulo | Ubicacion | Responsabilidad |
|---|---|---|
| Auth | `backend/src/modules/auth` | Login, usuario actual y generacion de token JWT. |
| Users | `backend/src/modules/users` | Gestion de usuarios, roles y permisos. |
| Inventory | `backend/src/modules/inventory` | Productos, categorias, stock e imagenes. |
| Sales | `backend/src/modules/sales` | Registro de ventas, detalle, comprobantes y metodos de pago. |
| Customers | `backend/src/modules/customers` | Registro, busqueda y actualizacion de clientes. |
| Employees | `backend/src/modules/employees` | Empleados, asistencias y boletas de pago. |
| Reports | `backend/src/modules/reports` | Indicadores y metricas del dashboard. |

---

## Capa de Rutas

Las rutas reciben las solicitudes HTTP del frontend. Por ejemplo, el modulo de ventas expone endpoints para:

- Listar historial de ventas.
- Obtener metodos de pago.
- Obtener tipos de comprobante.
- Buscar clientes.
- Crear una venta.

Archivo:

```txt
backend/src/modules/sales/sales.routes.ts
```

Ejemplo de ruta:

```ts
salesRouter.post("/", asyncHandler(async (req, res) => {
  // Logica para registrar una venta
}));
```

---

## Capa de Servicios, Controladores y Repositorios

En el modulo de usuarios se observa una organizacion orientada a objetos:

```txt
backend/src/modules/users/users.controller.ts
backend/src/modules/users/users.service.ts
backend/src/modules/users/users.repository.ts
```

Esta estructura separa responsabilidades:

| Archivo | Responsabilidad |
|---|---|
| `users.controller.ts` | Atiende la solicitud HTTP y devuelve respuestas. |
| `users.service.ts` | Contiene reglas de negocio del modulo de usuarios. |
| `users.repository.ts` | Accede a la base de datos mediante Prisma. |

Esta division mejora el orden del codigo y facilita el mantenimiento del sistema.

---

## Capa Compartida

La carpeta `backend/src/shared` contiene utilidades usadas por varios modulos.

| Archivo | Funcion |
|---|---|
| `prisma.ts` | Crea y exporta la instancia de Prisma Client. |
| `auth-middleware.ts` | Valida el token JWT y permisos del usuario. |
| `http-error.ts` | Define errores personalizados con codigo HTTP. |
| `async-handler.ts` | Centraliza el manejo de errores en rutas asincronas. |

Ejemplo de clase personalizada:

```ts
export class HttpError extends Error {
  statusCode: number;
  details?: unknown;
}
```

Esta clase permite responder errores controlados desde el backend.

---

## Seguridad del Backend

El backend aplica seguridad en varios niveles:

- **JWT:** protege rutas privadas mediante token.
- **Permisos por modulo:** controla el acceso segun permisos del usuario.
- **CORS:** limita los origenes permitidos.
- **Helmet:** agrega cabeceras de seguridad HTTP.
- **Zod:** valida datos recibidos antes de procesarlos.
- **bcryptjs:** protege contrasenas mediante hash.

Ejemplo de ruta protegida:

```ts
app.use("/api/v1/reports/dashboard", authenticate, requirePermission("dashboard"), dashboardRouter);
```

Esto indica que el dashboard solo puede ser consultado por usuarios autenticados y con permiso para ese modulo.

---

## Calculo de Ventas en Backend

El backend realiza el calculo definitivo de la venta para evitar que el total dependa solo del frontend.

Archivo:

```txt
backend/src/modules/sales/sales.routes.ts
```

Ejemplo:

```ts
const subtotal = subtotalSum;
const discountAmount = subtotal * (Number(discountPct) / 100);
const total = subtotal - discountAmount;
const changeAmount = Number(amountReceived) >= total ? Number(amountReceived) - total : 0;
```

Estos calculos permiten:

- Obtener el subtotal de todos los productos.
- Aplicar descuento.
- Calcular el total final.
- Calcular el vuelto.
- Registrar la venta con datos consistentes.

---

## Transacciones de Base de Datos

Para registrar una venta, el backend usa una transaccion con Prisma.

Esto permite que varias operaciones se ejecuten como una sola unidad:

- Crear la venta.
- Crear el detalle de venta.
- Restar stock del producto.
- Registrar movimiento de inventario.

Si una operacion falla, la transaccion evita que la venta quede guardada de forma incompleta.

Ejemplo:

```ts
const saleResult = await prisma.$transaction(async (tx) => {
  // Crear venta, detalle, actualizar stock y registrar movimiento
});
```

---

# Arquitectura de Base de Datos

## Prisma ORM

El proyecto usa Prisma como ORM para conectar el backend con PostgreSQL.

Archivo principal:

```txt
backend/prisma/schema.prisma
```

Prisma permite definir modelos de datos y relaciones entre tablas usando TypeScript.

---

## Modelos Principales

Los modelos principales del sistema son:

| Modelo | Tabla | Funcion |
|---|---|---|
| `User` | `usuarios` | Usuarios del sistema. |
| `Role` | `roles` | Roles de usuario. |
| `UserPermission` | `user_permissions` | Permisos por modulo. |
| `Employee` | `empleados` | Empleados del negocio. |
| `Product` | `productos` | Productos del inventario. |
| `Category` | `categorias` | Categorias de productos. |
| `Customer` | `clientes` | Clientes registrados. |
| `Sale` | `ventas` | Cabecera de ventas. |
| `SaleDetail` | `detalle_venta` | Productos vendidos por venta. |
| `PaymentMethod` | `metodos_pago` | Metodos de pago. |
| `VoucherType` | `tipos_comprobante` | Tipos de comprobante. |
| `PayrollSlip` | `boletas_pago_empleado` | Boletas de pago. |
| `InventoryMovement` | `movimientos_inventario` | Movimientos de stock. |

---

## Relacion Entre Frontend y Backend

La comunicacion entre frontend y backend se realiza mediante peticiones HTTP.

Ejemplo de flujo de una venta:

```txt
1. El usuario agrega productos al carrito en el POS.
2. El frontend calcula subtotal y vuelto estimado.
3. El usuario confirma la venta.
4. El frontend llama a createSale() en api.ts.
5. api.ts envia una peticion POST a /api/v1/sales.
6. El backend valida usuario, productos, stock y metodo de pago.
7. El backend calcula subtotal, descuento, total y vuelto.
8. Prisma registra la venta en PostgreSQL.
9. El backend responde con la venta creada.
10. El frontend muestra la boleta o resumen de venta.
```

---

## Endpoints Principales

| Endpoint | Metodo | Funcion |
|---|---|---|
| `/api/v1/health` | GET | Verificar estado de la API. |
| `/api/v1/auth/login` | POST | Iniciar sesion. |
| `/api/v1/auth/me` | GET | Obtener usuario autenticado. |
| `/api/v1/users` | GET/POST | Listar o crear usuarios. |
| `/api/v1/inventory/products` | GET/POST | Listar o crear productos. |
| `/api/v1/sales` | GET/POST | Listar o registrar ventas. |
| `/api/v1/sales/payment-methods` | GET | Listar metodos de pago. |
| `/api/v1/sales/voucher-types` | GET | Listar tipos de comprobante. |
| `/api/v1/customers` | GET/POST | Listar o crear clientes. |
| `/api/v1/employees` | GET/POST | Listar o crear empleados. |
| `/api/v1/reports/dashboard` | GET | Obtener indicadores del dashboard. |

---

# Despliegue

## Frontend

El frontend puede desplegarse en:

- Vercel.
- GitHub Pages como evidencia estatica.

URL principal documentada:

```txt
https://mepss-erp-frontend.vercel.app
```

## Backend

El backend se despliega como API en Render.

URL principal documentada:

```txt
https://mepss-erp-api.onrender.com/api/v1
```

## Base de Datos

La base de datos PostgreSQL se administra en Neon y se conecta al backend mediante la variable de entorno:

```txt
DATABASE_URL
```

---

# Conclusion

La arquitectura del proyecto MEPSS ERP esta organizada en frontend, backend y base de datos. El frontend con Next.js se encarga de la experiencia visual del usuario, el backend con Express centraliza la logica del negocio y Prisma conecta la API con PostgreSQL.

Esta separacion permite que el sistema sea modular, mantenible y escalable. Ademas, el uso de autenticacion JWT, permisos por modulo, validaciones, transacciones y ORM permite mantener seguridad e integridad en procesos importantes como ventas, inventario, usuarios y empleados.
