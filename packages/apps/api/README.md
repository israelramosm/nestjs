# @template/api

App NestJS del monorepo. Incluye módulos de `auth` (JWT/Passport), `users`,
`profiles` y `passwords`, con TypeORM (Postgres por defecto, MySQL opcional).

## Scripts

Ejecuta con `mise run <task> api` o `bun run --filter '@template/api' <script>`.

| Script (Bun filter)                                    | mise                 | Acción                                            |
| ------------------------------------------------------ | -------------------- | ------------------------------------------------- |
| `bun run --filter '@template/api' start`               | `mise run start api` | arranca con Bun (`bun src/main.ts`)               |
| `bun run --filter '@template/api' start:dev`           | —                    | arranca en watch (`bun --watch src/main.ts`)      |
| `bun run --filter '@template/api' start:debug`         | —                    | watch + inspector (`bun --inspect --watch`)       |
| `bun run --filter '@template/api' start:prod`          | —                    | arranca en producción (`NODE_ENV=production bun`) |
| `bun run --filter '@template/api' dev`                 | `mise run dev api`   | arranca directo con Bun (`bun --watch`)           |
| `bun run --filter '@template/api' build`               | `mise run build api` | build a `dist/` (`tsc -p tsconfig.build.json`)     |
| `bun run --filter '@template/api' clean`               | —                    | limpia `dist` y `*.tsbuildinfo`                   |
| `bun run --filter '@template/api' typecheck`           | —                    | `tsc --noEmit`                                    |
| `bun run --filter '@template/api' test`                | `mise run test api`  | tests unitarios (`bun test`)                      |
| `bun run --filter '@template/api' test:watch`          | —                    | tests unitarios en watch (`bun test --watch`)     |
| `bun run --filter '@template/api' test:cov`            | —                    | tests con cobertura (`bun test --coverage`)       |
| `bun run --filter '@template/api' test:e2e`            | —                    | tests e2e (requiere DB)                           |
| `bun run --filter '@template/api' migration:generate`  | —                    | genera una migración de TypeORM                   |
| `bun run --filter '@template/api' migration:create`    | —                    | crea una migración vacía                          |
| `bun run --filter '@template/api' migration:run`       | —                    | corre migraciones de TypeORM                      |
| `bun run --filter '@template/api' migration:revert`    | —                    | revierte la última migración                      |

## Dependencias del workspace

- `@template/configs-envs`: `Environments`, esquemas Joi, carga de `.env`, certs.
- `@template/shared`: tipos, DTOs, interfaces y factories de mocks para tests.
- `@template/configs-database`: datasources de TypeORM, `DatabaseModule` y migraciones.
- `@template/modules-identity`: módulos de auth, users, profiles y passwords.
- `@template/api-redis`: módulo global de Redis (`ioredis`), cableado en `AppModule`.
- `@template/kafka`: módulo + productor Kafka (opt-in, no cableado por defecto).

## Estructura

```text
src/
├── main.ts, app.module.ts, app.controller.ts, app.service.ts
└── config/          # typeorm.config.ts: datasource del CLI, con las entidades
e2e/                 # tests e2e
resources/           # Insomnia, ERD, drawio
```

## Base de datos e infra

Levanta Postgres y Redis con `bun run docker:up` desde la raíz y configura el
`.env` (ver `packages/libs/configs/envs/.env.example`). MySQL y Kafka se
levantan con sus profiles de docker-compose (`--profile mysql`, `--profile kafka`).
