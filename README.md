# NestJS Monorepo Template

Template **genérico** de monorepo para NestJS basado en **Bun workspaces**,
**Biome**, **mise** y **TypeORM**. Pensado para clonarse y empezar: mínimo y
listo para crecer con nuevas apps y libs.

## Stack

- **Bun** (workspaces + `catalog:` para versiones compartidas) como package
  manager y runtime.
- **Biome** para lint + format (reemplaza ESLint + Prettier).
- **mise** para fijar versiones de herramientas y gestionar `.env`.
- **husky** para hooks de git (`biome check` en pre-commit).
- **TypeORM** (Postgres por defecto, MySQL bajo profile).
- **`bun test`** para tests unitarios y e2e de la app `api`.
- **docker-compose** para infra local (postgres, mysql, redis, kafka).

## Estructura

```text
packages/
├── apps/
│   └── api/                 # app NestJS (auth, users, profiles, passwords)
└── libs/
    ├── configs/envs/        # @template/configs-envs (Environments, Joi, certs)
    ├── api/redis/           # @template/api-redis (módulo global ioredis)
    ├── kafka/               # @template/kafka (módulo + productor kafkajs)
    ├── interfaces/          # @template/interfaces (contratos compartidos)
    ├── utils/               # @template/utils (tipos + mocks de test)
    └── dto/                 # @template/dto (DTOs compartidos)
templates/                   # plantillas para crear apps/libs
scripts/                     # create-package.sh (generador de paquetes)
docs/                        # MONOREPO.md, NAMING-CONVENTIONS.md
```

Ver [`docs/MONOREPO.md`](docs/MONOREPO.md) y
[`docs/NAMING-CONVENTIONS.md`](docs/NAMING-CONVENTIONS.md).

## Requisitos

- [Bun](https://bun.sh) >= 1.2
- [mise](https://mise.jdx.dev) (opcional, recomendado para fijar versiones)
- Docker (opcional, para infra local)

## Quick start

```sh
mise install                 # instala bun/biome (si usas mise)
bun install                  # instala dependencias del workspace
mise run env:create          # crea packages/libs/configs/envs/.env
bun run docker:up            # levanta postgres/redis (mysql y kafka con profile)
mise run dev api             # arranca la app api en watch (o: bun run --filter '@template/api' dev)
```

Sin mise, copia el `.env` manualmente:

```sh
cp packages/libs/configs/envs/.env.example packages/libs/configs/envs/.env
```

## Scripts raíz

| Script                | Acción                                        |
| --------------------- | --------------------------------------------- |
| `bun run biome:check` | lint + format check de todo el repo           |
| `bun run biome:fix`   | corrige lint + format                         |
| `bun run typecheck`   | `typecheck` en todos los paquetes             |
| `bun run all:apps <s>`| corre el script `<s>` en todas las apps       |
| `bun run all:libs <s>`| corre el script `<s>` en todas las libs       |
| `bun run filter <pkg> <s>` | corre `<s>` en un workspace concreto     |
| `bun run dev:all`     | arranca todas las apps en paralelo            |
| `bun run docker:up`   | levanta la infra local (postgres/redis)       |
| `bun run docker:down` | baja la infra local                           |

Para un paquete concreto: `mise run test api` o `bun run --filter '@template/api' test`.

## Crear una app o lib

```sh
scripts/create-package.sh app <nombre> "<descripción>"
scripts/create-package.sh lib <nombre>
bun install
```

## Convenciones de imports

- Interno al paquete: `#src/*` o `src/*` (baseUrl).
- Entre paquetes: `@template/<paquete>` con dependencia `"workspace:*"`.
- Al clonar el template, renombra el scope `@template/` de forma global.

## Notas

- **Runtime Bun**: dev y producción corren directo con Bun (`bun --watch
  src/main.ts` / `bun src/main.ts`), sin paso de build. `nest build` sigue
  disponible para generar `dist/`, pero no es necesario para arrancar.
- **Carga de `.env`**: la app carga el `.env` compartido por sí sola
  (`@template/configs-envs/load-env`), sin depender de mise ni del cwd. mise
  sigue siendo útil para fijar versiones y gestionar `.env`, pero es opcional.
- **HTTPS opcional**: la app arranca en HTTP por defecto. Si existen
  `key.pem`/`cert.pem` en `configs-envs/src/certs/` levanta en HTTPS; puedes
  forzar HTTP con `HTTPS_ENABLED=false`.
- **Entidades TypeORM**: las relaciones usan el tipo `Relation<>` de TypeORM
  para evitar el TDZ por dependencias circulares bajo ESM/Bun.
- **Tests con `bun test`**: `bun run --filter '@template/api' test` (unit) y
  `test:e2e` (requiere DB). Cada archivo de test corre en su propio proceso
  (`scripts/run-tests.ts`) para replicar el aislamiento por-archivo que daba
  Jest — los specs comparten mocks singleton de `@template/utils`. Los tests
  unitarios mockean los repositorios (no requieren base de datos); los e2e sí
  requieren una base de datos activa.
