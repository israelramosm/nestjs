# @template/interfaces

Contratos/interfaces TypeScript compartidos entre las apps y libs del monorepo.
Solo tipos: no incluye código en tiempo de ejecución.

## Exports

Cada archivo de `src/` se publica como subpath vía la condición `./*` de
`exports`. Bun consume el `.ts` directamente; no hace falta compilar.

| Subpath                                    | Exporta                       | Descripción                          |
| ------------------------------------------ | ----------------------------- | ------------------------------------ |
| `@template/interfaces/api-response.interface` | `ApiResponse<T = unknown>` | Contrato genérico de respuesta de API |

`ApiResponse<T>` define los campos `success`, `data?`, `message?` y `errors?`.

## Uso

```ts
import type { ApiResponse } from '@template/interfaces/api-response.interface';

const res: ApiResponse<User> = { success: true, data: user };
```

Declara `@template/interfaces` como `"workspace:*"` en el `package.json` del
paquete consumidor.
