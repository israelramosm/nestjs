# templates/

Plantillas mínimas para crear **apps** y **libs** del monorepo. Los archivos con
placeholders se copian con `scripts/create-package.sh`, que sustituye los
marcadores y deja el paquete listo para agregar solo lo que necesite.

## Placeholders

| Placeholder         | Descripción                         |
| ------------------- | ----------------------------------- |
| `[APP_NAME]`        | Nombre de la app (ej. `api`)        |
| `[APP_DESCRIPTION]` | Descripción corta de la app         |
| `[LIB_NAME]`        | Nombre de la lib (ej. `configs-envs`) |

El scope es `@template/`. Al clonar el template, renombra el scope de forma
global.

## Configuración común

- Todos los paquetes son privados y ESM (`"type": "module"`).
- Cada `tsconfig.json` solo extiende `tsconfig.base.json`, incluye `src` y
  excluye `node_modules`. Agrega `compilerOptions` únicamente cuando el paquete
  tenga una necesidad que no cubra la base.
- `package.json` publica los subpaths TypeScript mediante las condiciones
  `types` y `default`, y permite consultar `./package.json`.
- Las plantillas incluyen un script `test` neutro. Cada paquete debe reemplazarlo
  y agregar únicamente los scripts y dependencias que realmente utilice.

## Convención de imports

- **Interno al paquete**: `#src/*`, definido en `imports`.
- **Entre paquetes**: `@template/<paquete>/<subpath>`, con el paquete declarado
  como `"workspace:*"`.
- Bun consume los archivos `.ts` directamente mediante `exports`; no se
  necesita compilar las librerías para usarlas dentro del workspace.

Ejemplo:

```ts
import { Environments } from '@template/configs-envs/Environments';
import { helper } from '#src/helper';
```

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
un `src/` con un stub mínimo. Las rutas `extends` de las plantillas asumen la
estructura `packages/apps/<name>` o `packages/libs/<name>`; una librería más
anidada debe ajustar la ruta relativa a `tsconfig.base.json`.
