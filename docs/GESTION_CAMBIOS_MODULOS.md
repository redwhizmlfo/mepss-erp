# Gestion de Cambios en Programas y/o Modulos

## Proyecto

El proyecto **MEPSS ERP** aplica gestion de cambios para controlar, registrar y validar las modificaciones realizadas en sus programas, modulos y componentes principales. Esta practica permite mantener la estabilidad del sistema, reducir errores en produccion y asegurar que cada cambio realizado tenga una justificacion tecnica.

El sistema esta compuesto por los siguientes bloques principales:

- **Frontend:** aplicacion web desarrollada con Next.js.
- **Backend:** API REST desarrollada con Node.js y Express.
- **Base de datos:** PostgreSQL administrado en Neon.
- **ORM:** Prisma.
- **Despliegue:** Vercel, Render y GitHub Pages.
- **Control de versiones:** Git y GitHub.

---

## Objetivo de la Gestion de Cambios

El objetivo de la gestion de cambios es asegurar que toda modificacion realizada en el sistema sea planificada, implementada, revisada y validada antes de ser integrada a la rama principal del repositorio.

Esta gestion permite:

- Controlar los cambios en el codigo fuente.
- Evitar modificaciones no documentadas.
- Validar que los modulos sigan funcionando despues de cada cambio.
- Mantener trazabilidad mediante commits en GitHub.
- Reducir riesgos antes del despliegue en produccion.

---

## Modulos Sujetos a Cambios

Los principales modulos del proyecto que pueden recibir cambios son:

| Modulo | Ubicacion | Tipo de cambio |
|---|---|---|
| Autenticacion | `backend/src/modules/auth` y `frontend/src/features/auth` | Login, validacion de usuario, token JWT y acceso al sistema. |
| Clientes | `backend/src/modules/customers` y `frontend/src/features/customers` | Registro, busqueda, actualizacion y visualizacion de clientes. |
| Inventario | `backend/src/modules/inventory` y `frontend/src/app/inventory/products` | Productos, stock, imagenes, busqueda y catalogo. |
| Ventas POS | `backend/src/modules/sales` y `frontend/src/app/sales/pos` | Registro de ventas, seleccion de productos, clientes y metodos de pago. |
| Reportes | `backend/src/modules/reports` y `frontend/src/features/dashboard` | Indicadores, metricas y panel principal. |
| Usuarios | `backend/src/modules/users` y `frontend/src/features/admin-users` | Gestion de usuarios administrativos y roles. |
| Despliegue | `.github/workflows`, `frontend/next.config.ts` | CI/CD, GitHub Pages, Vercel y Render. |

---

## Flujo de Gestion de Cambios

El flujo utilizado para gestionar cambios en programas y modulos del proyecto es el siguiente:

## 1. Identificacion del Cambio

Primero se identifica la necesidad del cambio. Esta puede originarse por:

- Correccion de errores.
- Mejora funcional.
- Solicitud del docente o usuario.
- Ajuste de despliegue.
- Optimizacion de busqueda o rendimiento.
- Actualizacion de datos del sistema.

Ejemplo aplicado al proyecto:

```txt
Se identifico la necesidad de mejorar la busqueda del modulo de inventario para permitir consultas naturales como "pintura roja de 2 litros".
```

---

## 2. Analisis del Impacto

Antes de modificar el codigo se revisa que archivos, rutas y componentes pueden verse afectados.

Aspectos evaluados:

- Modulo donde se realizara el cambio.
- Relacion con otros modulos.
- Impacto en frontend.
- Impacto en backend.
- Impacto en base de datos.
- Riesgo para el despliegue en Vercel, Render o GitHub Pages.

Ejemplo aplicado:

```txt
Para mejorar la busqueda de inventario se reviso el componente InventoryClient.tsx y se verifico que el cambio solo afectara la forma de filtrar productos en el frontend, sin modificar la estructura de la base de datos.
```

---

## 3. Implementacion del Cambio

Luego del analisis se realiza la modificacion en el archivo correspondiente. Los cambios se aplican de forma controlada, respetando la estructura existente del proyecto.

Buenas practicas utilizadas:

- Mantener los cambios dentro del modulo afectado.
- Evitar modificar archivos no relacionados.
- Respetar la arquitectura frontend/backend.
- Usar nombres claros para funciones, rutas y componentes.
- Mantener compatibilidad con los despliegues existentes.

Ejemplo aplicado:

```txt
Se agrego una busqueda natural en el modulo de inventario, permitiendo encontrar productos mediante palabras comunes, sinonimos y caracteristicas del producto.
```

---

## 4. Validacion Local

Despues de implementar el cambio se ejecutan validaciones para comprobar que el sistema sigue funcionando correctamente.

Validaciones aplicadas segun el tipo de cambio:

```bash
npm run lint -w backend
npm run build -w backend
npm run build -w frontend
npm run build
```

Estas validaciones permiten detectar:

- Errores de TypeScript.
- Problemas de compilacion.
- Errores en dependencias.
- Fallas de integracion entre backend y frontend.

---

## 5. Registro del Cambio en Git

Una vez validado, el cambio se registra mediante Git. Cada commit debe describir de forma breve el cambio realizado.

Ejemplos de commits usados en el proyecto:

```txt
Add GitHub Actions CI workflow
Add GitHub Pages frontend deploy
Allow GitHub Pages frontend origin
Deduplicate product search terms
Add product update endpoint
Add natural inventory search
```

Este registro permite mantener trazabilidad sobre:

- Que cambio se realizo.
- Cuando se realizo.
- En que archivos se aplico.
- Que objetivo tuvo el cambio.

---

## 6. Integracion con GitHub Actions

Cuando el cambio se sube a GitHub, los workflows de GitHub Actions ejecutan validaciones automaticas.

El proyecto cuenta con acciones CI/CD para:

- Instalar dependencias.
- Generar Prisma Client.
- Validar backend.
- Compilar frontend.
- Compilar el proyecto completo.
- Publicar frontend estatico en GitHub Pages.

Archivo principal:

```txt
.github/workflows/ci-cd.yml
```

Archivo de despliegue GitHub Pages:

```txt
.github/workflows/github-pages.yml
```

---

## 7. Despliegue del Cambio

Cuando el cambio es aceptado en la rama principal, el sistema puede desplegarse en los servicios configurados:

| Servicio | Uso en el proyecto |
|---|---|
| Vercel | Despliegue principal del frontend. |
| Render | Despliegue principal del backend/API. |
| Neon | Base de datos PostgreSQL en la nube. |
| GitHub Pages | Despliegue estatico del frontend como evidencia academica. |

URL de frontend principal:

```txt
https://mepss-erp-frontend.vercel.app
```

URL de API:

```txt
https://mepss-erp-api.onrender.com/api/v1
```

URL de GitHub Pages:

```txt
https://redwhizmlfo.github.io/mepss-erp/
```

---

## Ejemplos de Cambios Realizados en el Proyecto

## Cambio 1: Configuracion de CI/CD

Se implementaron workflows de GitHub Actions para validar el proyecto y desplegar el frontend en GitHub Pages.

Archivos modificados:

```txt
.github/workflows/ci-cd.yml
.github/workflows/github-pages.yml
frontend/next.config.ts
```

Resultado:

```txt
El proyecto cuenta con integracion continua y despliegue continuo basico.
```

---

## Cambio 2: Correccion de Navegacion en GitHub Pages

Se ajusto la navegacion del frontend para que los modulos funcionen correctamente bajo la ruta base de GitHub Pages.

Archivos modificados:

```txt
frontend/src/components/layout/AppShell.tsx
frontend/src/components/layout/nav-items.ts
```

Resultado:

```txt
Los modulos internos del sistema pueden navegarse correctamente desde GitHub Pages.
```

---

## Cambio 3: Mejora de Busqueda en Inventario

Se agrego busqueda natural en el modulo de inventario para que el usuario pueda encontrar productos escribiendo frases no tecnicas.

Archivo modificado:

```txt
frontend/src/app/inventory/products/InventoryClient.tsx
```

Ejemplo:

```txt
pintura roja de 2 litros
cemento sol
cable electrico
fierro de construccion
```

Resultado:

```txt
El usuario puede buscar productos de forma mas cercana al lenguaje cotidiano.
```

---

## Cambio 4: Actualizacion de Productos y Clientes

Se actualizaron productos y clientes para trabajar con datos mas cercanos a un caso real de ferreteria.

Modulos impactados:

```txt
Inventario
Clientes
Ventas POS
```

Resultado:

```txt
El sistema muestra productos, marcas y clientes mas representativos para una ferreteria real.
```

---

## Control de Riesgos

Para reducir riesgos en cada cambio se aplican las siguientes medidas:

- Revisar el modulo antes de modificarlo.
- Validar que el cambio no afecte archivos no relacionados.
- Ejecutar compilacion local.
- Usar commits descriptivos.
- Verificar despliegue despues del push.
- Mantener separadas las variables de entorno.
- No exponer credenciales reales en el repositorio.

---

## Conclusion

La gestion de cambios en el proyecto MEPSS ERP permite mantener control sobre las modificaciones realizadas en programas y modulos. Cada cambio es identificado, analizado, implementado, validado y registrado mediante Git y GitHub Actions. Esto asegura que el sistema pueda evolucionar sin perder estabilidad, trazabilidad ni calidad tecnica.













.github/workflows/ci-cd.yml
.github/workflows/github-pages.yml
frontend/next.config.ts