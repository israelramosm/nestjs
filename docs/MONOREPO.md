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
├── templates/
│   ├── README.md
│   ├── package.app.template.json
│   ├── package.lib.template.json
│   ├── tsconfig.app.template.json
│   └── tsconfig.lib.template.json
├── scripts/
│   └── create-package.sh
├── docs/
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
    │       ├── tsconfig.build.json
    │       └── jest.config.json
    └── libs/
        ├── configs/
        │   └── envs/
        ├── api/
        │   └── redis/
        ├── kafka/
        ├── interfaces/
        ├── utils/
        └── dto/
```

## Stack técnico

| Área | Herramienta | Uso |
| --- | --- | --- |
| Runtime y package manager | Bun | Ejecuta TypeScript directo, instala dependencias y gestiona workspaces. |
| Workspaces | Bun workspaces | Paquetes bajo `packages/*/**`. |
| Versiones compartidas | `catalog:` | Centraliza versiones en el `package.json` raíz. |
| Versiones de herramientas | mise | Fija Bun/Biome y expone tareas como `env:create`. |
| Lint y formato | Biome | Reemplaza ESLint + Prettier con una sola herramienta. |
| Hooks Git | husky | Ejecuta `biome check` en pre-commit. |
| Framework | NestJS | Base de las aplicaciones. |
| ORM | TypeORM | Configuración de base de datos dentro de cada app que la use. |
| Tests | Jest | Tests unitarios/e2e de las apps. |
| Infra local | docker-compose | Postgres por defecto; MySQL, Redis y Kafka con profiles cuando aplique. |

## Librerías incluidas

| Lib | Paquete | Uso |
| --- | --- | --- |
| Envs y config | `@template/configs-envs` | `Environments`, esquemas Joi, carga de `.env`, certs. |
| Utils | `@template/utils` | Tipos y mocks de providers genéricos. |
| DTOs | `@template/dto` | DTOs compartidos (p. ej. paginación). |
| Interfaces | `@template/interfaces` | Contratos/tipos compartidos (p. ej. `ApiResponse`). |
| Redis | `@template/api-redis` | Módulo global NestJS sobre `ioredis` (`lazyConnect`). |
| Kafka | `@template/kafka` | Módulo + productor sobre `@nestjs/microservices`/`kafkajs`. |

## Apps vs libs

- **Apps**: viven en `packages/apps/<name>`, son ejecutables y tienen scripts como `start`, `dev` o `start:dev`. Ejemplo: `@template/api`.
- **Libs**: viven en `packages/libs/...`, no son ejecutables y exponen código compartido. Normalmente solo tienen `build`, `clean` y `typecheck`.
- Las apps consumen libs con dependencias `workspace:*` y nombres `@template/<pkg>`.
- Las libs exponen código mediante `exports`, por ejemplo `"./*": "./src/*.ts"`.

## Scripts raíz

| Script | Uso |
| --- | --- |
| `bun run biome:check` | Revisa formato y lint del repo. |
| `bun run biome:fix` | Aplica fixes seguros de Biome. |
| `bun run biome:format` | Formatea archivos. |
| `bun run biome:lint` | Ejecuta solo lint. |
| `bun run all:apps <script>` | Ejecuta un script en todas las apps (`packages/apps/*`). |
| `bun run all:libs <script>` | Ejecuta un script en todas las libs (`packages/libs/*`). |
| `bun run filter <pkg> <script>` | Ejecuta un script en un workspace concreto (`bun run --filter`). |
| `bun run typecheck` | `tsc --noEmit` en todos los paquetes. |
| `bun run dev:all` | Arranca todas las apps en paralelo (`dev`). |
| `bun run docker:up` | Levanta servicios locales. |
| `bun run docker:down` | Detiene servicios locales. |
| `bun run watch:libs` | Observa cambios en libs cuando el flujo lo requiera. |
| `bun run prepare` | Instala/configura husky. |

> Para ejecutar un script en un paquete concreto usa el filtro de Bun o una tarea de mise:
> `bun run --filter '@template/api' dev` o `mise run dev api`.

## Quick start de desarrollo

```bash
mise install
bun install
mise run env:create
bun run docker:up
mise run dev api        # o: bun run --filter '@template/api' dev
```

> Este template asume que las versiones de herramientas están fijadas con `.mise.toml`. Si clonas el template para otro proyecto, primero renombra globalmente el scope `@template/`.

## Ejecución de apps y libs

Usa las tareas de **mise** (que envuelven el filtro de Bun) o `bun run --filter` directamente. Ya no existe un `app-runner` propio.

```bash
# App NestJS principal (mise)
mise run dev api
mise run test api
mise run build api

# Equivalente con el filtro de Bun
bun run --filter '@template/api' dev
bun run --filter '@template/api' test
bun run --filter '@template/api' test:e2e

# Lib compartida
bun run --filter '@template/utils' typecheck
bun run --filter '@template/dto' build

# Todas las apps / libs a la vez
bun run all:apps typecheck
bun run all:libs typecheck
```

Reglas prácticas:

- Filtra por el nombre del paquete (`@template/<pkg>`), no por su ruta.
- Usa `all:apps` / `all:libs` para correr un script en todos los paquetes de un tipo.
- Las apps pueden tener runtime y tests e2e.
- Las libs deben mantenerse reutilizables y sin lógica de arranque propia.

## Imports entre paquetes

- Código interno del paquete: `#src/*` mediante el campo `imports` del `package.json` del paquete.
- Alternativa interna aceptada: `baseUrl` apuntando a `src/*` cuando el paquete lo configure.
- Código entre paquetes: `@template/<pkg>` con dependencia `workspace:*`.
- Versiones externas compartidas: `catalog:` desde la raíz.
- Bun ejecuta TypeScript directamente; por eso las libs pueden exponer archivos `.ts` explícitos en runtime.

Ejemplo:

```ts
import { Environments } from '@template/configs-envs/Environments.ts';
import { PaginationDto } from '@template/dto/pagination.dto.ts';
import { localHelper } from '#src/local-helper.ts';
```

## Crear un paquete nuevo

Usa el generador del repo:

```bash
scripts/create-package.sh <app|lib> <name>
```

Ejemplos:

```bash
scripts/create-package.sh app admin
scripts/create-package.sh lib reports
```

El script copia los archivos desde `templates/`, reemplaza placeholders como `[APP_NAME]`, `[APP_DESCRIPTION]` o `[LIB_NAME]`, y crea un stub inicial en `src/`.

Después de crear el paquete:

1. Revisa el `package.json` generado.
2. Agrega dependencias internas con `workspace:*` si consume otras libs.
3. Usa `catalog:` para dependencias externas compartidas.
4. Ejecuta el script correspondiente con `mise run <task> <pkg>` o `bun run --filter '@template/<pkg>' <script>`.
