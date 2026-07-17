# Manual de Usuario del Software (MEPSS ERP)

Este manual documenta el uso de los módulos y funcionalidades disponibles en el sistema MEPSS ERP.

## Inicio de sesión
Para acceder al sistema, el usuario debe proveer su correo electrónico y contraseña previamente registrados. En caso de error, el sistema alertará sobre credenciales inválidas.

## Dashboard
Una vez validado el acceso, el usuario aterriza en el **Dashboard**, un panel principal que muestra métricas generales, alertas de inventario y resúmenes de venta.

## Productos
Este módulo permite consultar el catálogo de artículos disponibles. Se pueden visualizar detalles técnicos, marcas y precios.

## Ventas
El Punto de Venta (POS) permite procesar operaciones para clientes finales.
- Búsqueda de productos mediante código o nombre.
- Ajuste de cantidades.
- Cálculo de totales.
- Emisión de la venta.

## Inventario
Visualiza las existencias actuales de cada producto. Permite a los responsables del almacén identificar artículos próximos a agotarse.

## Clientes
Registro y actualización de la base de datos de compradores frecuentes, lo que facilita agilizar el flujo del Punto de Venta.

## Proveedores
Gestión del listado de empresas suministradoras. Permite enlazar a quién se le debe realizar un pedido.

## Pedidos
Sección donde se generan órdenes de compra hacia los proveedores registrados con el fin de reponer inventario.

## Empleados
Administración del personal que trabaja en la empresa.

## Usuarios
Gestión de credenciales de acceso al sistema (cuentas). Un empleado puede o no tener usuario asociado para ingresar al ERP.

## Roles y permisos
Controla a qué partes del software puede acceder cada usuario de acuerdo a la asignación de su rol.

## Reportes
Generación de métricas estadísticas (ej. Ventas del mes, productos más vendidos) necesarias para la toma de decisiones gerenciales.

## Cierre de sesión
Opción de seguridad para revocar el token de acceso actual en el dispositivo en uso.

## Errores frecuentes
- **CORS Error**: Ocurre si el frontend intenta comunicarse con el backend desde una URL no autorizada en `app.ts`.
- **Base de datos fuera de línea**: Si visualizas "Database connection error", verifica el estado de PostgreSQL (o Neon) y que las variables `.env` sean correctas.
