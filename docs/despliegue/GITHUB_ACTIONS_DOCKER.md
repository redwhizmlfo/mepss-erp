# Documentación de GitHub Actions para Docker

## Nombre del Workflow
**Docker CI/CD** (Archivo responsable: `.github/workflows/docker-ci.yml`)

## Eventos que lo activan
El flujo de integración y entrega continua (CI/CD) se activa en los siguientes eventos:
- **Push** a la rama `main`.
- **Pull Request** hacia la rama `main`.
- **workflow_dispatch**: Ejecución manual desde la pestaña Actions en GitHub.

## Jobs
El flujo contiene un único trabajo principal: `build-and-test`.

## Pasos ejecutados
1. **Checkout del repositorio**: Obtiene el código fuente.
2. **Creación de .env para testing**: Copia `.env.docker.example` a `.env` para su uso en el pipeline.
3. **Configuración de Docker Buildx**: Habilita funcionalidades avanzadas de construcción.
4. **Construcción e inicio**: Ejecuta `docker compose build` y `docker compose up -d` para construir e iniciar los tres contenedores (PostgreSQL, Backend, Frontend).
5. **Validación de salud (Healthchecks)**:
   - Espera a que PostgreSQL esté reportando un estado saludable.
   - Espera a que el backend esté listo y disponible.
   - Realiza una petición `HTTP GET` al frontend validando un código `200 OK`.
6. **Desmontaje**: Apaga y limpia los recursos creados (`docker compose down -v`).
7. **Publicación en GHCR**: Si el evento no es un pull request, inicia sesión en GitHub Container Registry, extrae metadata de la ejecución, y sube las imágenes construidas.

## Manejo de Errores y Validaciones
La validación en GitHub Actions es estricta. Fallará de forma real si:
- Un Dockerfile no compila debido a errores de código o dependencias faltantes.
- Un contenedor se detiene inesperadamente.
- El backend no responde al endpoint de salud.
- El frontend no responde con un estado `HTTP 200`.

Al ocurrir un error durante los bucles de espera de salud, el pipeline imprimirá los logs (`docker compose logs <servicio>`) y forzará la terminación con código 1.

## Permisos requeridos
Se asignan los permisos mínimos:
```yaml
permissions:
  contents: read
  packages: write
```

## Cómo ejecutar el workflow manualmente
1. Dirígete a tu repositorio en GitHub.
2. Haz clic en la pestaña **Actions**.
3. En la barra lateral izquierda, selecciona **Docker CI/CD**.
4. Haz clic en el botón desplegable **Run workflow** ubicado a la derecha.
5. Selecciona la rama (ej. `main`) y presiona el botón verde **Run workflow**.

## Cómo revisar logs y errores
Si el workflow falla, en la ejecución correspondiente se mostrará una `x` roja. Al entrar en ese job particular y expandir el paso que falló, podrás leer el error exacto (ej: logs del backend indicando un problema con las credenciales de la DB).

## Relación con Vercel y Render
Este pipeline **no despliega ni afecta** los recursos alojados en Vercel, Render o Neon. Proporciona una comprobación adicional, asegurando que si la aplicación se despliega como contenedor, ésta va a arrancar correctamente.
