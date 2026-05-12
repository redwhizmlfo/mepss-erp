# Referencias Visuales para GitHub, Kanban y Flujo de Trabajo

Este documento traduce las imagenes de referencia del usuario en requisitos concretos para el proyecto.

## 1. Flujo de actividades / ciclo de vida de Issues

Referencia visual:

- Encabezado con proyecto, duracion y numero de sprints.
- Equipo visible con roles.
- Flujo numerado de 8 pasos.
- Ejemplo real de Issues.
- Leyenda para interpretar Issue, milestone, responsable, estado y duracion.

Resultado esperado en este proyecto:

```txt
1. Identificar necesidad o requerimiento
2. Crear Issue en GitHub
3. Etiquetar y priorizar
4. Asignar responsable y Sprint/Milestone
5. Planificar en Kanban
6. Ejecutar
7. Revisar y validar
8. Cerrar como Done
```

Aplicacion al ERP:

- Cada modulo debe tener Issues: Dashboard, Ventas, Inventario, Proveedores, Empleados, Clientes, Perdidas, Reportes y Administracion.
- Cada Issue debe incluir checklist interno.
- Cada Issue debe tener prioridad, sprint, responsable y criterios de aceptacion.

## 2. Tablero Kanban en GitHub

Referencia visual:

- Columnas: Backlog, To Do, In Progress, Code Review, Done.
- Cards con numero de Issue, titulo, tipo, prioridad, sprint, responsable, fecha y duracion.
- Leyenda de etiquetas.

Resultado esperado:

Columnas recomendadas:

- `Backlog`
- `To Do`
- `In Progress`
- `Code Review`
- `QA`
- `Done`

Formato de card:

```txt
#4 Crear dashboard ejecutivo avanzado
Tipo: Historia de usuario
Prioridad: Alta
Sprint: Sprint 1
Responsable: @usuario
Inicio: AAAA-MM-DD
Duracion: 4 dias
```

## 3. Gestion con hitos estilo Gantt

Referencia visual:

- Sprints agrupados por fechas.
- Issues distribuidos por responsable.
- Barras de duracion.
- Separacion por milestone.

Resultado esperado:

Milestones sugeridos:

- `Sprint 1 - Base del proyecto`
- `Sprint 2 - Seguridad y administracion`
- `Sprint 3 - Catalogo e inventario`
- `Sprint 4 - Ventas y proveedores`
- `Sprint 5 - Empleados y pagos`
- `Sprint 6 - Reportes y cierre`

Cada Issue debe tener:

- Fecha de inicio.
- Duracion estimada.
- Sprint/Milestone.
- Responsable.

## 4. Flujo GitFlow visual

Referencia visual:

- Backlog.
- To Do / Sprint Planning.
- Feature / Task / Bug branches.
- In Progress.
- Code Review / QA.
- Done / Closed.
- Ramas por tipo: `feature/*`, `bug/*`, `docs/*`, `test/*`.

Resultado esperado:

Ramas:

```txt
main
feature/issue-numero-descripcion
bugfix/issue-numero-descripcion
docs/issue-numero-descripcion
test/issue-numero-descripcion
```

Estados equivalentes:

```txt
Backlog -> To Do -> Rama -> In Progress -> Pull Request -> Code Review/QA -> Merge -> Done
```

## 5. Como debe verse el resultado en GitHub

El repositorio debe contener:

- `.github/ISSUE_TEMPLATE/actividad.md`
- `docs/GITHUB_ISSUES_KANBAN.md`
- `docs/PROTOCOLO_SINCRONIZACION_GITHUB.md`
- `docs/REFERENCIAS_VISUALES_GITHUB.md`

El tablero debe permitir ver:

- Que se esta haciendo.
- Quien lo hace.
- En que sprint esta.
- Que prioridad tiene.
- Que checks faltan.
- Si ya fue revisado.
- Si ya esta cerrado.

## 6. Regla para futuras mejoras

Cada vez que se implemente una mejora:

- Se crea o actualiza un Issue.
- Se actualiza el checklist.
- Se actualiza documentacion si cambia arquitectura o flujo.
- Se hace commit con referencia al Issue.
- Se hace push a GitHub.

