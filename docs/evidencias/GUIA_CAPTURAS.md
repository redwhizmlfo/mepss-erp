# Guía de Capturas y Evidencias

El objetivo de este documento es detallar explícitamente las capturas que el estudiante debe presentar como evidencia funcional del proyecto y su despliegue en entornos locales e integrados.

Por favor, reemplace las rutas de marcadores pendientes con las imágenes reales cuando disponga de ellas.

## Capturas de Docker

* **Docker Desktop abierto**: Muestra el panel general de Docker comprobando su instalación.
  ![Evidencia pendiente: docker desktop abierto](./docker/docker-desktop-abierto.png)

* **`docker compose build`**: Resultado en terminal de la compilación de imágenes de backend y frontend.
  ![Evidencia pendiente: docker compose build](./docker/docker-compose-build.png)

* **`docker compose up -d`**: Comando de inicialización de los contenedores y creación de red.
  ![Evidencia pendiente: docker compose up -d](./docker/docker-compose-up-d.png)

* **`docker compose ps`**: Verificación de contenedores activos en estado "Up" y "healthy".
  ![Evidencia pendiente: docker compose ps](./docker/docker-compose-ps.png)

* **Contenedores activos**: Panel de Docker Desktop o terminal ampliada mostrando que los tres contenedores (postgres, backend, frontend) están funcionando conjuntamente.
  ![Evidencia pendiente: contenedores activos](./docker/contenedores-activos.png)

* **Logs del backend**: Terminal demostrando la conexión exitosa a Prisma y el backend arrancado.
  ![Evidencia pendiente: logs del backend](./docker/logs-del-backend.png)

* **Endpoint de salud**: Captura del navegador en `http://localhost:<PUERTO>/api/v1/health` retornando estado OK.
  ![Evidencia pendiente: endpoint de salud](./docker/endpoint-de-salud.png)

* **Frontend local funcionando**: Navegador en `http://localhost:<PUERTO>` mostrando la interfaz.
  ![Evidencia pendiente: frontend local funcionando](./docker/frontend-local-funcionando.png)

## Capturas de GitHub Actions

* **Pestaña Actions**: Pantalla principal mostrando la lista de flujos de trabajo.
  ![Evidencia pendiente: pestaña actions](./github-actions/pestana-actions.png)

* **Workflow Docker**: Selección del workflow "Docker CI/CD".
  ![Evidencia pendiente: workflow docker](./github-actions/workflow-docker.png)

* **Ejecución completa**: Pantalla resumen del build indicando un estado verde (Success).
  ![Evidencia pendiente: ejecucion completa](./github-actions/ejecucion-completa.png)

* **Jobs en estado exitoso**: Detalle de los pasos internos completados exitosamente.
  ![Evidencia pendiente: jobs en estado exitoso](./github-actions/jobs-estado-exitoso.png)

* **Build del backend**: Desglose del log de actions demostrando la construcción de la imagen backend.
  ![Evidencia pendiente: build del backend](./github-actions/build-backend.png)

* **Build del frontend**: Desglose del log de actions demostrando la construcción de la imagen frontend.
  ![Evidencia pendiente: build del frontend](./github-actions/build-frontend.png)

* **Prueba de salud**: Logs de curl verificando el estado del endpoint de salud.
  ![Evidencia pendiente: prueba de salud](./github-actions/prueba-salud.png)

* **Publicación en GHCR**: (Sólo si fue realizada) Verificación de la subida a Github Packages.
  ![Evidencia pendiente: publicacion en ghcr](./github-actions/publicacion-ghcr.png)

## Capturas del software

* **Login**: Interfaz de autenticación.
  ![Evidencia pendiente: login](./software/login.png)

* **Dashboard**: Panel de métricas iniciales.
  ![Evidencia pendiente: dashboard](./software/dashboard.png)

* **Ventas**: Módulo Punto de Venta o registro de venta.
  ![Evidencia pendiente: ventas](./software/ventas.png)

* **Inventario**: Listado de control de almacén.
  ![Evidencia pendiente: inventario](./software/inventario.png)

* **Productos**: Gestión del catálogo.
  ![Evidencia pendiente: productos](./software/productos.png)

* **Clientes**: Libreta de clientes y registro.
  ![Evidencia pendiente: clientes](./software/clientes.png)

* **Proveedores**: Entidades proveedoras.
  ![Evidencia pendiente: proveedores](./software/proveedores.png)

* **Pedidos**: Gestión de abastecimiento.
  ![Evidencia pendiente: pedidos](./software/pedidos.png)

* **Empleados**: Listado del personal.
  ![Evidencia pendiente: empleados](./software/empleados.png)

* **Usuarios y roles**: Configuración de acceso.
  ![Evidencia pendiente: usuarios y roles](./software/usuarios-roles.png)

* **Reportes**: Análisis estadístico.
  ![Evidencia pendiente: reportes](./software/reportes.png)

* **Sistema desplegado en Vercel**: URL pública de Vercel funcionando en navegador.
  ![Evidencia pendiente: sistema desplegado en vercel](./software/vercel-funcionando.png)
