# @template/utils

Lib compartida con **tipos genéricos** y **helpers/factories de mocks para tests**
del monorepo. Bun consume los `.ts` de `src/` directamente vía `exports` (subpath
comodín `./*`); no necesita build para usarse dentro del workspace.

## Qué exporta

| Subpath                                | Contenido                                                        |
| -------------------------------------- | --------------------------------------------------------------- |
| `@template/utils/types`                | `HealthCheck` (`{ ok: boolean; message: string }`)              |
| `@template/utils/tests/mocks/providers.mocks` | factories de mocks para providers de NestJS (ver abajo). |

### Factories de mocks (`providers.mocks`)

| Helper                        | Devuelve                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `createMockRepository`        | mock de repositorio TypeORM (`save`, `find`, `findOne`, `update`, `delete`) |
| `createMockRestService`       | mock de servicio REST (`create`, `findAll`, `findOneById`, `update`, `remove`) |
| `createMockRestServiceData`   | igual que el anterior, con métodos resolviendo un valor dado   |
| `createMockUserRestService`   | REST service + `findOneByEmail`                                 |
| `createMockAuthService`       | mock de auth (`validateUser`, `login`)                         |
| `createMockJWTService`        | mock de JWT (`sign`)                                            |

> Cada helper es una **factory**: devuelve mocks nuevos por invocación, por lo que
> **no son singletons**. Así cada test mantiene su estado aislado y `bun test`
> puede correr todos los archivos en un único proceso sin filtrar llamadas entre
> suites.

## Uso

Declara la lib como `"@template/utils": "workspace:*"` e importa por subpath:

```ts
import type { HealthCheck } from '@template/utils/types';
import { createMockRepository } from '@template/utils/tests/mocks/providers.mocks';

const repo = createMockRepository();
repo.findOne.mockResolvedValue({ id: 1 });
```

Import interno al paquete: `#src/*` (definido en `imports`).
