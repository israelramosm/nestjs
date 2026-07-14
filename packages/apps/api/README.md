# @template/api

App NestJS del monorepo. Incluye módulos de `auth` (JWT/Passport), `users`,
`profiles` y `passwords`, con TypeORM (Postgres por defecto, MySQL opcional).

## Scripts

Ejecuta con `mise run <task> api` o `bun run --filter '@template/api' <script>`.

| Script (Bun filter)                                    | mise                | Acción                                  |
| ------------------------------------------------------ | ------------------- | --------------------------------------- |
| `bun run --filter '@template/api' start:dev`           | —                   | arranca con `nest start --watch`        |
| `bun run --filter '@template/api' dev`                 | `mise run dev api`  | arranca directo con Bun (`bun --watch`) |
| `bun run --filter '@template/api' build`               | `mise run build api`| build de producción (`nest build`)      |
| `bun run --filter '@template/api' test`                | `mise run test api` | tests unitarios (Jest)                  |
| `bun run --filter '@template/api' test:e2e`            | —                   | tests e2e (requiere DB)                 |
| `bun run --filter '@template/api' typecheck`           | —                   | `tsc --noEmit`                          |
| `bun run --filter '@template/api' migration:run`       | —                   | corre migraciones de TypeORM            |

## Dependencias del workspace

- `@template/configs-envs`: `Environments`, esquemas Joi, carga de `.env`, certs.
- `@template/utils`: tipos genéricos y helpers de mocks para tests.
- `@template/dto`: DTOs compartidos.
- `@template/interfaces`: contratos/tipos compartidos.
- `@template/api-redis`: módulo global de Redis (`ioredis`), cableado en `AppModule`.
- `@template/kafka`: módulo + productor Kafka (opt-in, no cableado por defecto).

## Estructura

```text
src/
├── main.ts, app.module.ts, app.controller.ts, app.service.ts
├── common/          # constants, decorators
├── config/          # pgdb/mysqldb/typeorm config (específicos de la app)
├── database/        # database.module + migrations (pg y mysql)
├── utils/tests/     # data.mocks (fixtures específicos de la app)
└── modules/         # auth, users, profiles, passwords
e2e/                 # tests e2e
resources/           # Insomnia, ERD, drawio
```

## Base de datos e infra

Levanta Postgres y Redis con `bun run docker:up` desde la raíz y configura el
`.env` (ver `packages/libs/configs/envs/.env.example`). MySQL y Kafka se
levantan con sus profiles de docker-compose (`--profile mysql`, `--profile kafka`).
