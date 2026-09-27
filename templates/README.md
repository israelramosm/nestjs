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
- Las apps reciben además un `tsconfig.build.json` (`noEmit: false`, `outDir:
  dist`), que es lo que usa el script `build`.
- `package.json` publica los subpaths TypeScript mediante las condiciones
  `types` y `default`, y permite consultar `./package.json`.

## Scripts que traen las plantillas

Son los que necesitan las tareas de mise para funcionar desde el minuto uno:

| Script      | app | lib | Tarea de mise                      |
| ----------- | --- | --- | ---------------------------------- |
| `typecheck` | sí  | sí  | `mise run typecheck [pkg]`         |
| `clean`     | sí  | sí  | `mise run clean`                   |
| `dev`       | sí  | —   | `mise run dev <pkg>`               |
| `start`     | sí  | —   | `mise run start <pkg>`             |
| `start:prod`| sí  | —   | (solo por filtro de Bun)           |
| `build`     | sí  | —   | `mise run build [pkg]`             |

Las libs no llevan `build`: Bun consume sus `.ts` directo vía `exports`.

**No traen `test` a propósito.** `bun test` sale con código 1 cuando no
encuentra archivos de test, así que un paquete recién creado con script `test`
rompería `mise run test` y el CI del repo entero. Agrégalo cuando escribas el
primer test:

```json
"test": "bun test src"
```

Todo lo demás (dependencias, `test:watch`, `test:cov`, `test:e2e`,
`migration:*`) se agrega solo si el paquete lo necesita.

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
las mismas versiones de NestJS, TypeORM, etc.

## Crear un paquete

```sh
# app
mise run new:app <nombre> "<descripción>"
# lib
mise run new:lib <nombre>
```

Las tareas envuelven `scripts/create-package.sh`, que copia los archivos de
`templates/`, sustituye los placeholders y crea un `src/` con un stub mínimo;
después la tarea corre `bun install`.

Falta a mano: agregar `"@template/<nombre>": "workspace:*"` en el `package.json`
del paquete que lo consuma.

Las rutas `extends` de las plantillas asumen la estructura
`packages/apps/<name>` o `packages/libs/<name>`; una librería más anidada debe
ajustar la ruta relativa a `tsconfig.base.json`.
