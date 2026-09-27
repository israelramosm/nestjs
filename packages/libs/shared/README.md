# @template/shared

Tipos, DTOs, interfaces y factories de mocks compartidos entre las apps y libs
del monorepo. Solo contratos y helpers: nada con lógica de arranque.

Bun consume los `.ts` de `src/` directamente vía `exports` (subpath comodín
`./*`); no necesita build para usarse dentro del workspace.

## Qué exporta

| Subpath | Contenido |
| --- | --- |
| `@template/shared/types` | `HealthCheck` (`{ ok: boolean; message: string }`) |
| `@template/shared/dto/pagination.dto` | `PaginationDto` (clase) y `Paginated<T>` |
| `@template/shared/interfaces/api-response.interface` | `ApiResponse<T = unknown>`: `success`, `data?`, `message?`, `errors?` |
| `@template/shared/tests/mocks/providers.mocks` | factories de mocks para providers de NestJS (ver abajo) |

### Factories de mocks (`providers.mocks`)

| Helper | Devuelve |
| --- | --- |
| `createMockRepository` | mock de repositorio TypeORM (`save`, `find`, `findOne`, `update`, `delete`) |
| `createMockRestService` | mock de servicio REST (`create`, `findAll`, `findOneById`, `update`, `remove`) |
| `createMockRestServiceData` | igual que el anterior, con métodos resolviendo un valor dado |
| `createMockUserRestService` | REST service + `findOneByEmail` |
| `createMockAuthService` | mock de auth (`validateUser`, `login`) |
| `createMockJWTService` | mock de JWT (`sign`) |

> Cada helper es una **factory**: devuelve mocks nuevos por invocación, no son
> singletons. Así cada test mantiene su estado aislado y `bun test` puede correr
> todos los archivos en un único proceso sin que las llamadas se filtren entre
> suites.

## Uso

Declara el paquete como `"@template/shared": "workspace:*"` e importa por
subpath:

```ts
import type { HealthCheck } from '@template/shared/types';
import { PaginationDto } from '@template/shared/dto/pagination.dto';
import { createMockRepository } from '@template/shared/tests/mocks/providers.mocks';

const repo = createMockRepository();
repo.findOne.mockResolvedValue({ id: 1 });
```

Import interno al paquete: `#src/*` (definido en `imports`). Las rutas
relativas están prohibidas por `biome.json`.

## Scripts

| Script | Acción |
| --- | --- |
| `clean` | limpia `dist` y `*.tsbuildinfo` |
| `typecheck` | `tsc --noEmit` |
