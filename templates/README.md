# templates/

Plantillas base para crear **apps** y **libs** del monorepo. Los archivos con
placeholders se copian con `scripts/create-package.sh` y se sustituyen los
marcadores.

## Placeholders

| Placeholder         | Descripción                         |
| ------------------- | ----------------------------------- |
| `[APP_NAME]`        | Nombre de la app (ej. `api`)        |
| `[APP_DESCRIPTION]` | Descripción corta de la app         |
| `[LIB_NAME]`        | Nombre de la lib (ej. `configs-envs`) |

El scope es `@template/`. Al clonar el template, renombra el scope de forma
global.

## Apps vs Libs

- **Apps** (`packages/apps/<name>`): ejecutables. Tienen `start`/`dev`
  (`bun --watch src/main.ts`), `build`, `clean`, `typecheck`. Dependen de libs
  vía `workspace:*`.
- **Libs** (`packages/libs/<name>`): NO ejecutables, compartidas. Solo `build`,
  `clean`, `typecheck`. Exponen su código con `exports` (`"./*": "./src/*.ts"`).

## Convención de imports

- **Interno al paquete**: `#src/*` (campo `imports` del `package.json`) o el
  `baseUrl` `src/*`.
- **Entre paquetes**: `@template/<paquete>` declarado como `"workspace:*"`.
- **Extensión `.ts` explícita**: Bun ejecuta TypeScript directo, sin build
  obligatorio; por eso las libs exportan sus fuentes `.ts`.

## Versiones compartidas

Usa `catalog:` en las dependencias para heredar la versión definida en el
`package.json` raíz (`workspaces.catalog`). Así todas las apps/libs comparten
las mismas versiones de NestJS, TypeORM, Jest, etc.

## Crear un paquete

```sh
# app
scripts/create-package.sh app <nombre> "<descripción>"
# lib
scripts/create-package.sh lib <nombre>
```

El script copia los archivos de `templates/`, sustituye los placeholders y crea
un `src/` con un stub mínimo.
