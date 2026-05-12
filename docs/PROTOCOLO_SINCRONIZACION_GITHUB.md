# Protocolo de Sincronizacion GitHub

Este proyecto debe mantenerse sincronizado con GitHub a medida que se implementa. Cada avance funcional debe terminar con documentacion, verificacion, commit y push.

Repositorio remoto:

```bash
https://github.com/redwhizmlfo/mepss-erp
```

## 1. Regla principal

Cada ciclo de trabajo debe seguir este orden:

```txt
1. Revisar estado local
2. Crear o actualizar Issue relacionado
3. Implementar cambio
4. Actualizar documentacion si aplica
5. Ejecutar verificacion
6. Revisar git diff/status
7. Crear commit claro
8. Hacer push a origin/main o a la rama correspondiente
9. Actualizar estado del Issue/Kanban
```

## 2. Comandos base

Antes de trabajar:

```bash
git status --short --branch
git pull --ff-only
```

Despues de implementar:

```bash
npm run build -w backend
npm run build -w frontend
git status --short
git diff --stat
git add .
git commit -m "tipo(scope): descripcion"
git push
```

## 3. Politica de commits

Formato:

```txt
tipo(scope): descripcion corta
```

Tipos:

- `feat`: nueva funcionalidad.
- `fix`: correccion.
- `docs`: documentacion.
- `chore`: configuracion o mantenimiento.
- `refactor`: mejora interna sin cambiar comportamiento.
- `test`: pruebas.

Ejemplos:

```bash
git commit -m "feat(dashboard): agrega resumen de inventario"
git commit -m "docs(github): agrega protocolo de sincronizacion"
git commit -m "fix(sales): valida stock antes de vender"
```

## 4. Relacion Issue -> Rama -> Commit

Cada actividad importante debe tener Issue.

Rama sugerida:

```txt
feature/issue-4-dashboard-avanzado
bugfix/issue-12-login
docs/issue-7-api-rest
```

Commit sugerido:

```txt
feat(dashboard): implementa graficos ejecutivos refs #4
```

Pull Request sugerido:

```txt
Closes #4
```

## 5. Actualizacion del Kanban

Estados:

- `Backlog`: idea identificada.
- `To Do`: lista para ejecutarse.
- `In Progress`: en desarrollo.
- `Code Review`: cambio listo para revisar.
- `QA`: validacion visual/funcional.
- `Done`: terminado y subido.

Regla:

- Si el codigo ya fue subido, el Issue no debe quedar en `In Progress` sin explicacion.
- Si falta prueba, debe pasar por `QA`.
- Si falta documentacion, no debe cerrarse.

## 6. Verificacion minima por tipo de cambio

Frontend:

```bash
npm run build -w frontend
```

Backend:

```bash
npm run build -w backend
npm run prisma:generate
```

Base de datos:

```bash
docker compose up -d
npm run prisma:migrate
```

Full stack:

```bash
npm run build
```

## 7. Documentacion que debe actualizarse

Cuando cambie arquitectura, modulos o rutas:

- `docs/BASE_DATOS_Y_PROMPT_PROYECTO.md`
- `docs/STACK_TECNICO_NEXT_NODE_PRISMA.md`

Cuando cambie gestion de trabajo:

- `docs/GITHUB_ISSUES_KANBAN.md`
- `.github/ISSUE_TEMPLATE/actividad.md`

Cuando cambie instalacion o comandos:

- `README.md`

## 8. Resultado esperado al final de cada avance

Cada entrega debe dejar:

- Codigo funcionando o avance documentado.
- Build ejecutado si aplica.
- Documentacion actualizada si aplica.
- Git limpio o con una razon clara.
- Push realizado a GitHub.
- Issue/Kanban actualizado o listo para actualizarse.

## 9. Referencias visuales del flujo

Las imagenes de referencia entregadas por el usuario se interpretan como objetivo visual/documental para el flujo GitHub:

- Ciclo de vida de Issues con pasos numerados.
- Tablero Kanban con columnas.
- Gestion por hitos tipo Gantt.
- Flujo GitFlow con ramas y estados.

El resultado en el proyecto debe respetar esas referencias mediante documentacion, plantillas y convenciones.

