# @template/api

App NestJS del monorepo. Incluye módulos de `auth` (JWT/Passport), `users`,
`profiles` y `passwords`, con TypeORM (Postgres por defecto, MySQL opcional).

## Comandos

La interfaz recomendada es mise. Los scripts de `package.json` siguen ahí y se
pueden llamar con `bun run --filter '@template/api' <script>`.

| Comando                         | Acción                                            |
| ------------------------------- | ------------------------------------------------- |
| `mise run dev api`              | arranca en watch (`bun --watch src/main.ts`)      |
| `mise run start api`            | arranca sin watch (`bun src/main.ts`)             |
| `mise run build api`            | build a `dist/` (`tsc -p tsconfig.build.json`)    |
| `mise run typecheck api`        | `tsc --noEmit`                                    |
| `mise run test api`             | tests unitarios (`bun test`)                      |
| `mise run test:watch api`       | tests unitarios en watch                          |
| `mise run test:cov api`         | tests con cobertura                               |
| `mise run test:e2e api`         | tests e2e (requiere DB)                           |
| `mise run migration:generate <N>` | genera una migración de TypeORM                 |
| `mise run migration:create <N>` | crea una migración vacía                          |
| `mise run migration:run`        | corre migraciones de TypeORM                      |
| `mise run migration:revert`     | revierte la última migración                      |

Sin tarea de mise, solo por filtro de Bun:

| Script                                         | Acción                                            |
| ---------------------------------------------- | ------------------------------------------------- |
| `bun run --filter '@template/api' start:debug` | watch + inspector (`bun --inspect --watch`)       |
| `bun run --filter '@template/api' start:prod`  | arranca en producción (`NODE_ENV=production bun`) |

`mise run clean` limpia `dist` y `*.tsbuildinfo` de todos los paquetes.

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
