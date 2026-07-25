# Convenciones de nombres e imports

Este template usa convenciones simples para que apps y libs sean fáciles de encontrar, ejecutar y renombrar al clonar el repositorio.

## Scope de paquetes

El scope por defecto es:

```text
@template/
```

Al usar este repositorio como base para otro proyecto, realiza un rename global del scope. Por ejemplo:

```text
@template/ -> @mi-organizacion/
```

Mantén el mismo scope en todos los paquetes, imports y dependencias internas.

## Nombres de apps

Las apps viven en:

```text
packages/apps/<name>
```

Su nombre de paquete debe ser:

```text
@template/<name>
```

Ejemplo:

```text
packages/apps/api  ->  @template/api
```

Reglas:

- Usa nombres cortos y en kebab-case si tienen más de una palabra.
- Una app debe ser ejecutable y puede tener scripts `start`, `dev`, `start:dev`, `test` o `test:e2e`.
- No pongas libs compartidas dentro de `packages/apps`; extráelas a `packages/libs`.

## Nombres de libs

Las libs viven en `packages/libs` y deben ser reutilizables. Hay dos formas comunes:

```text
packages/libs/<name>
packages/libs/<group>/<name>
```

Reglas de nombre de paquete:

```text
packages/libs/<name>          ->  @template/<name>
packages/libs/<group>/<name>  ->  @template/<group>-<name>
```

Ejemplos:

```text
packages/libs/utils          ->  @template/utils
packages/libs/dto            ->  @template/dto
packages/libs/configs/envs   ->  @template/configs-envs
```

## Grupos recomendados

Usa grupos cuando ayuden a preparar futuras extracciones:

| Grupo | Patrón de paquete | Uso |
| --- | --- | --- |
| `configs` | `@template/configs-*` | Configuración, variables de entorno, schemas, certificados. |
| `modules` | `@template/modules-*` | Módulos NestJS extraídos para compartir entre apps. |

Ejemplos futuros:

```text
packages/libs/configs/envs    ->  @template/configs-envs
packages/libs/modules/auth    ->  @template/modules-auth
packages/libs/modules/users   ->  @template/modules-users
```

## Convenciones de imports

### Imports internos al paquete

Preferido:

```ts
import { helper } from '#src/helper.ts';
```

Esto depende del campo `imports` en el `package.json` del paquete:

```json
{
  "imports": {
    "#src/*": "./src/*"
  }
}
```

También se permite usar rutas basadas en `src/*` cuando el paquete configure `baseUrl`.

### Imports entre paquetes

Usa siempre el nombre publicado del workspace:

```ts
import { Environments } from '@template/configs-envs/Environments.ts';
import { PaginationDto } from '@template/dto/pagination.dto.ts';
```

El paquete consumidor debe declarar la dependencia interna así:

```json
{
  "dependencies": {
    "@template/dto": "workspace:*"
  }
}
```

### Exports de libs

Las libs deben exponer sus archivos compartidos con `exports`:

```json
{
  "exports": {
    "./*": "./src/*.ts"
  }
}
```

Esto permite imports explícitos y evita depender de rutas físicas como `packages/libs/...`.

## `workspace:*`, `catalog:` y extensiones `.ts`

- Usa `workspace:*` para dependencias internas del monorepo.
- Usa `catalog:` para dependencias externas con versión compartida desde la raíz.
- Mantén extensiones `.ts` explícitas en imports cross-package cuando apunten a exports de libs.
- Bun puede ejecutar TypeScript directamente, por lo que no es obligatorio compilar para correr en desarrollo.

Ejemplo de dependencias:

```json
{
  "dependencies": {
    "@template/configs-envs": "workspace:*",
    "@nestjs/common": "catalog:",
    "joi": "catalog:"
  }
}
```

## Archivos y carpetas

- Usa `src/` para el código fuente del paquete.
- Usa `e2e/` solo en apps que tengan pruebas end-to-end.
- Usa `resources/` para recursos de apoyo de una app, no para código compartido.
- Evita imports relativos largos entre paquetes; si cruza límites de paquete, debe ser `@template/*`.

## Branches y commits

Mantén nombres descriptivos y genéricos. Se recomienda Conventional Commits cuando aplique:

```text
feat(monorepo): agregar nueva lib compartida
docs: actualizar convenciones de paquetes
refactor(api): mover módulo a packages/apps/api
```
