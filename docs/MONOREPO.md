# Monorepo NestJS con Bun Workspaces

Este repositorio es un **template genérico** para aplicaciones NestJS organizadas como monorepo. Usa Bun como runtime/package manager, workspaces para separar apps y libs, y un conjunto único de herramientas compartidas en la raíz.

## Arquitectura objetivo

```text
nestjs/
├── package.json              # workspaces, catalog y scripts raíz
├── bunfig.toml               # configuración de Bun
├── .mise.toml                # versiones de herramientas y tareas de entorno
├── tsconfig.base.json        # configuración TypeScript compartida
├── tsconfig.json             # referencia/base para el IDE
├── biome.json                # lint y format con Biome
├── docker-compose.yml        # servicios locales: postgres, mysql, redis, kafka
├── .github/
│   └── workflows/
│       └── ci.yml            # typecheck, biome, tests y audit
├── templates/
│   ├── README.md
│   ├── package.app.template.json
│   ├── package.lib.template.json
│   ├── tsconfig.app.template.json
│   └── tsconfig.lib.template.json
├── scripts/
│   └── create-package.sh
├── docs/
│   ├── DATABASE-NOTES.md
│   ├── MONOREPO.md
│   └── NAMING-CONVENTIONS.md
└── packages/
    ├── apps/
    │   └── api/
    │       ├── src/
    │       ├── e2e/
    │       ├── resources/
    │       ├── package.json
    │       ├── tsconfig.json
    │       └── tsconfig.build.json
    └── libs/
        ├── configs/
        │   ├── database/
        │   └── envs/
        ├── modules/
        │   └── identity/
        ├── api/
        │   └── redis/
        ├── kafka/
        └── shared/
```

## Stack técnico

| Área | Herramienta | Uso |
| --- | --- | --- |
| Runtime y package manager | Bun | Ejecuta TypeScript directo, instala dependencias y gestiona workspaces. |
| Workspaces | Bun workspaces | Paquetes bajo `packages/*/**`. |
| Versiones compartidas | `catalog:` | Centraliza versiones en el `package.json` raíz. |
| Versiones de herramientas | mise | Fija la versión de Bun y es el entry point de todas las tareas (`mise tasks`). |
| Lint y formato | Biome | Reemplaza ESLint + Prettier con una sola herramienta. |
| Hooks Git | `.githooks/` + `core.hooksPath` | `pre-commit` llama a `mise run check:staged`. Se activa con `mise run setup`. |
| Framework | NestJS | Base de las aplicaciones. |
| ORM | TypeORM | Datasources, módulo y migraciones en `@template/configs-database`. |
| Tests | `bun test` | Runner nativo de Bun; no hay Jest en el repo. |
| Infra local | docker-compose | Postgres y Redis por defecto; MySQL y Kafka con profiles. |
| CI | GitHub Actions | `ci.yml`: typecheck, biome, tests de la api y `bun audit`. |

## Librerías incluidas

| Lib | Paquete | Uso |
| --- | --- | --- |
| Base de datos | `@template/configs-database` | Datasources de Postgres/MySQL, `DatabaseModule` y migraciones. |
| Identidad | `@template/modules-identity` | Módulos NestJS de auth, users, profiles y passwords, con sus entidades. |
| Envs y config | `@template/configs-envs` | `Environments`, esquemas Joi, carga de `.env`, certs. |
| Compartidos | `@template/shared` | Tipos, DTOs, interfaces y factories de mocks de test. |
| Redis | `@template/api-redis` | Módulo global NestJS sobre `ioredis` (`lazyConnect`). |
| Kafka | `@template/kafka` | Módulo + productor sobre `@nestjs/microservices`/`kafkajs`. |

## Apps vs libs

- **Apps**: viven en `packages/apps/<name>`, son ejecutables y tienen scripts como `start`, `dev` o `start:dev`. Ejemplo: `@template/api`.
- **Libs**: viven en `packages/libs/...`, no son ejecutables y exponen código compartido. Solo tienen `clean` y `typecheck`: se consumen por fuente, no compilan a `dist`.
- Las apps consumen libs con dependencias `workspace:*` y nombres `@template/<pkg>`.
- Las libs exponen código mediante `exports`, por ejemplo `"./*": "./src/*.ts"`.

## Tareas

El entry point del repo es mise: `mise tasks` lista todo con su descripción.
La tabla completa está en el [README](../README.md#tareas).

Las tareas con `[pkg]` corren en todo el monorepo si no les pasas argumento, y
en un paquete si se lo pasas, con nombre corto o completo:

| Tarea | Uso |
| --- | --- |
| `mise run check` / `fix` / `lint` / `format` | Biome: verificar, corregir, solo lint, solo format. |
| `mise run typecheck [pkg]` | `tsc --noEmit`. |
| `mise run test [pkg]` | Tests de los paquetes que tengan script `test`. |
| `mise run build [pkg]` | Build a `dist/` con `tsc`. |
| `mise run dev <pkg>` / `dev:all` / `dev:libs` | Watch de un paquete, de todas las apps, o de todas las libs. |
| `mise run docker:up` / `docker:down` | Servicios locales. |
| `mise run migration:*` | TypeORM CLI (ver [DATABASE-NOTES](DATABASE-NOTES.md)). |
| `mise run new:app` / `new:lib` | Genera un paquete desde `templates/`. |
| `mise run ci` | Reproduce en local lo que corre CI. |

> Detrás de cada tarea hay un script de `package.json`: eso es lo que
> `bun run --filter` necesita para resolver el grafo de workspaces. Se pueden
> llamar a mano (`bun run --filter '@template/api' dev`), pero la interfaz
> recomendada es mise.

## Quick start de desarrollo

```bash
mise install            # instala la versión de bun de .mise.toml
mise run setup          # bun install + activa los git hooks de .githooks/
mise run env:create
mise run docker:up
mise run dev api
```

> Este template asume que las versiones de herramientas están fijadas con `.mise.toml`. Si clonas el template para otro proyecto, primero renombra globalmente el scope `@template/`.

## Ejecución de apps y libs

Usa las tareas de **mise** (que envuelven el filtro de Bun) o `bun run --filter` directamente. Ya no existe un `app-runner` propio.

```bash
# App NestJS principal
mise run dev api
mise run test api
mise run test:e2e api
mise run build api

# Lib compartida (mismo formato, nombre corto del paquete)
mise run typecheck shared

# Todo el monorepo: sin argumento
mise run typecheck
mise run test

# Equivalente con el filtro de Bun, si lo necesitas
bun run --filter '@template/api' dev
```

Reglas prácticas:

- A mise dale el nombre corto (`api`, `shared`); si llamas a `bun run --filter`
  a mano, filtra por el nombre del paquete (`@template/<pkg>`), no por su ruta.
- Omite el argumento para correr en todo el monorepo.
- Las apps pueden tener runtime y tests e2e.
- Las libs deben mantenerse reutilizables y sin lógica de arranque propia.

## Imports entre paquetes

- Código interno del paquete: `#src/*` mediante el campo `imports` del `package.json` del paquete.
- Código entre paquetes: `@template/<pkg>` con dependencia `workspace:*`.
- Versiones externas compartidas: `catalog:` desde la raíz.
- **Sin extensión** en el especificador: el `exports` map de cada paquete
  (`"./*"` → `"./src/*.ts"`) la agrega. Con `.ts` explícito el typecheck falla
  con TS2307.
- Bun ejecuta TypeScript directo, así que las libs se consumen por fuente y no
  hace falta build previo.
- Sin rutas relativas: `style/noRestrictedImports` en `biome.json` las rechaza.

Ejemplo:

```ts
import { Environments } from '@template/configs-envs/Environments';
import { PaginationDto } from '@template/shared/dto/pagination.dto';
import { localHelper } from '#src/local-helper';
```

## Crear un paquete nuevo

Usa el generador del repo:

```bash
scripts/create-package.sh <app|lib> <name>
```

Ejemplos:

```bash
mise run new:app admin "API de administración"
mise run new:lib reports
```

La tarea envuelve `scripts/create-package.sh`, que copia los archivos desde `templates/`, reemplaza placeholders como `[APP_NAME]`, `[APP_DESCRIPTION]` o `[LIB_NAME]`, y crea un stub inicial en `src/`. Después la tarea corre `bun install`.

Después de crear el paquete:

1. Revisa el `package.json` generado.
2. Agrega dependencias internas con `workspace:*` si consume otras libs.
3. Usa `catalog:` para dependencias externas compartidas.
4. Agrega al `package.json` generado los scripts que quieras poder correr: las plantillas solo traen `test`, así que un paquete nuevo no responde a `mise run typecheck <pkg>` ni a `build` hasta que los agregues.
5. Ejecuta la tarea correspondiente con `mise run <task> <pkg>`.
