# NestJS Monorepo Template

Template **genérico** de monorepo para NestJS basado en **Bun workspaces**,
**Biome**, **mise** y **TypeORM**. Pensado para clonarse y empezar: mínimo y
listo para crecer con nuevas apps y libs.

## Stack

- **Bun** (workspaces + `catalog:` para versiones compartidas) como package
  manager y runtime.
- **Biome** para lint + format (reemplaza ESLint + Prettier).
- **mise** como entry point de todas las tareas del repo, y para fijar la
  versión de Bun y gestionar el `.env`.
- **Git hooks versionados** en `.githooks/` (`pre-commit` → `mise run
  check:staged`), sin dependencias.
- **TypeORM** (Postgres por defecto, MySQL bajo profile).
- **`bun test`** para tests unitarios y e2e de la app `api`.
- **docker-compose** para infra local (postgres, mysql, redis, kafka).

## Estructura

```text
packages/
├── apps/
│   └── api/                 # app NestJS (arranque, health check, CLI de TypeORM)
└── libs/
    ├── configs/database/    # @template/configs-database (datasources, migraciones)
    ├── configs/envs/        # @template/configs-envs (Environments, Joi, certs)
    ├── modules/identity/    # @template/modules-identity (auth, users, profiles, passwords)
    ├── api/redis/           # @template/api-redis (módulo global ioredis)
    ├── kafka/               # @template/kafka (módulo + productor kafkajs)
    └── shared/              # @template/shared (tipos, DTOs, interfaces, mocks)
templates/                   # plantillas para crear apps/libs
scripts/                     # create-package.sh (generador de paquetes)
docs/                        # DATABASE-NOTES.md, MONOREPO.md, NAMING-CONVENTIONS.md
.githooks/                   # pre-commit (activar con: mise run setup)
.mise.toml                   # versión de Bun y todas las tareas del repo
```

Ver [`docs/MONOREPO.md`](docs/MONOREPO.md) y
[`docs/NAMING-CONVENTIONS.md`](docs/NAMING-CONVENTIONS.md).

## Requisitos

- [mise](https://mise.jdx.dev) — fija la versión de Bun y es el entry point de
  todas las tareas del repo (`mise tasks` las lista).
- [Bun](https://bun.sh) >= 1.2 — lo instala mise.
- Docker (opcional, para infra local)

## Quick start

```sh
mise install                 # instala la versión de bun fijada en .mise.toml
mise run setup               # bun install + activa los git hooks de .githooks/
mise run env:create          # crea packages/libs/configs/envs/.env
mise run docker:up           # levanta postgres/redis (mysql y kafka con profile)
mise run dev api             # arranca la app api en watch
```

Sin mise, copia el `.env` manualmente:

```sh
cp packages/libs/configs/envs/.env.example packages/libs/configs/envs/.env
```

## Tareas

`mise tasks` lista todo con su descripción. Las que llevan `<pkg>` aceptan el
nombre corto (`api`, `modules-identity`) o el completo (`@template/api`); sin
argumento corren en todo el monorepo.

| Tarea                            | Acción                                             |
| -------------------------------- | -------------------------------------------------- |
| `mise run setup`                 | `bun install` + activa los git hooks               |
| `mise run dev <pkg>`             | arranca un paquete en watch                        |
| `mise run dev:all`               | arranca todas las apps en paralelo                 |
| `mise run dev:libs`              | arranca todas las libs en watch                    |
| `mise run start <pkg>`           | arranca un paquete sin watch                       |
| `mise run build [pkg]`           | build a `dist/` con `tsc`                          |
| `mise run clean`                 | borra `dist/` y `*.tsbuildinfo`                    |
| `mise run typecheck [pkg]`       | `tsc --noEmit`                                     |
| `mise run test [pkg]`            | tests unitarios (sin DB)                           |
| `mise run test:watch <pkg>`      | tests de un paquete en watch                       |
| `mise run test:cov <pkg>`        | tests de un paquete con coverage                   |
| `mise run test:e2e [pkg]`        | tests e2e de una app (necesita DB)                 |
| `mise run check`                 | lint + format en verificación (no escribe)         |
| `mise run fix`                   | corrige lint + format                              |
| `mise run lint` / `format`       | solo lint / solo format                            |
| `mise run audit`                 | vulnerabilidades de las dependencias               |
| `mise run ci`                    | lo mismo que corre CI, en local                    |
| `mise run migration:generate <N>`| genera una migración diffeando entidades vs DB     |
| `mise run migration:create <N>`  | crea una migración vacía                           |
| `mise run migration:run`         | aplica las migraciones pendientes                  |
| `mise run migration:revert`      | deshace la última migración                        |
| `mise run docker:up` / `:down`   | levanta / baja la infra local                      |
| `mise run new:app` / `new:lib`   | crea un paquete desde `templates/`                 |
| `mise run env:*`                 | gestión del `.env` compartido                      |
| `mise run dev:clean*`            | limpieza de `node_modules`, locks y caches         |

Las migraciones escriben en `pg/` por defecto; con `--driver mysql` van a
`mysql/`.

Detrás de cada tarea hay un script de `package.json`, que es lo que
`bun run --filter` necesita para el grafo de workspaces. Se pueden seguir
llamando a mano (`bun run --filter '@template/api' dev`), pero la interfaz
recomendada es mise.

## Crear una app o lib

```sh
mise run new:app <nombre> "<descripción>"
mise run new:lib <nombre>
```

La tarea corre `bun install` por ti. Falta a mano: agregar la dependencia
`"@template/<nombre>": "workspace:*"` en el paquete que lo consuma.

## Convenciones de imports

- Interno al paquete: `#src/*` o `src/*` (baseUrl).
- Entre paquetes: `@template/<paquete>` con dependencia `"workspace:*"`.
- Al clonar el template, renombra el scope `@template/` de forma global.

## Notas

- **Runtime Bun**: dev y producción corren directo con Bun (`bun --watch
  src/main.ts` / `bun src/main.ts`), sin paso de build. El script `build`
  (`tsc -p tsconfig.build.json`) sigue disponible para generar `dist/`, pero no
  es necesario para arrancar.
- **Carga de `.env`**: la app carga el `.env` compartido por sí sola
  (`@template/configs-envs/load-env`), sin depender de mise ni del cwd. mise
  sigue siendo útil para fijar versiones y gestionar `.env`, pero es opcional.
- **Git hooks**: el `pre-commit` vive en `.githooks/` (versionado) y solo llama
  a `mise run check:staged`. `git config core.hooksPath` no viaja con el clone,
  así que hay que correr `mise run setup` (o `mise run hooks`) una vez.
- **HTTPS opcional**: la app arranca en HTTP por defecto. Si existen
  `key.pem`/`cert.pem` en `configs-envs/src/certs/` levanta en HTTPS; puedes
  forzar HTTP con `HTTPS_ENABLED=false`.
- **Entidades TypeORM**: las relaciones usan el tipo `Relation<>` de TypeORM
  para evitar el TDZ por dependencias circulares bajo ESM/Bun.
- **Tests con `bun test`**: los tests corren con el runner nativo de Bun
  directamente. Unitarios: `mise run test api` (mockean los repositorios, no
  requieren base de datos). E2E: `mise run test:e2e api` (requiere una base de
  datos activa).
