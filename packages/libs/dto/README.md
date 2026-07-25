# @template/dto

DTOs y tipos compartidos entre las apps y libs del monorepo. Centraliza los
contratos de datos para reutilizarlos sin duplicarlos.

## Exports

El paquete expone cada archivo de `src/` como un subpath
(`@template/dto/<archivo>`).

| Subpath                     | Contenido                                              |
| --------------------------- | ------------------------------------------------------ |
| `@template/dto/pagination.dto` | `PaginationDto` (clase) y `Paginated<T>` (interface) |

## Uso

Declara el paquete como `"@template/dto": "workspace:*"` e importa el subpath:

```ts
import { PaginationDto, Paginated } from '@template/dto/pagination.dto';

async function list(query: PaginationDto): Promise<Paginated<User>> {
  // ...
}
```

Bun consume los `.ts` directamente vía `exports`; no hace falta compilar la lib
para usarla dentro del workspace.

## Scripts

| Script      | Acción                          |
| ----------- | ------------------------------- |
| `build`     | compila con `tsc` a `dist`      |
| `clean`     | limpia `dist` y `*.tsbuildinfo` |
| `typecheck` | `tsc --noEmit`                  |
