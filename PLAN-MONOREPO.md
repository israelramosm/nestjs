# Plan: Conversión del template NestJS a Monorepo

> Basado en la arquitectura y tecnologías de `trade-solution/trade` (Bun workspaces + TypeScript + Biome + templates de paquetes), **sin copiar su lógica de negocio**. El objetivo es que este repo siga siendo un template: mínimo, genérico y listo para clonar.

---

## 1. Estado actual vs. estado objetivo

### Estado actual (app única NestJS)

```
nestjs/
├── src/
│   ├── main.ts, app.module.ts, app.controller.ts, app.service.ts
│   ├── config/          # Environments, schemas Joi, typeorm/pg/mysql configs, certs
│   ├── common/          # constants, decorators (public)
│   ├── database/        # database.module + migrations (pg y mysql)
│   ├── utils/           # types, mocks para tests
│   └── modules/         # auth (JWT/Passport), users, profiles, passwords
├── test/                # e2e
├── resources/           # Insomnia, ERD, drawio
├── package.json         # npm, ESLint + Prettier, Jest, TypeORM
└── tsconfig*.json, nest-cli.json, jest.config.json
```

### Estado objetivo (monorepo)

```
nestjs/  (monorepo template)
├── package.json              # raíz: workspaces + catalog + scripts globales
├── bunfig.toml
├── .mise.toml                # tools (bun, biome) + tareas env:create/check/backup
├── tsconfig.base.json        # config estricta compartida (nodenext, noEmit)
├── tsconfig.json             # solo referencia/base para el IDE
├── biome.json                # reemplaza ESLint + Prettier
├── docker-compose.yml        # postgres + mysql (con profiles)
├── templates/                # ⭐ base para crear nuevas apps/libs
│   ├── README.md
│   ├── package.app.template.json
│   ├── package.lib.template.json
│   ├── tsconfig.app.template.json
│   └── tsconfig.lib.template.json
├── scripts/
│   ├── app-runner.ts         # runner de apps/libs por filtro
│   └── create-package.sh     # genera app/lib desde templates/
├── docs/
│   ├── MONOREPO.md           # convenciones del monorepo
│   └── NAMING-CONVENTIONS.md
└── packages/
    ├── apps/
    │   └── api/              # la app NestJS actual, migrada
    │       ├── src/          # main, app.module, database, modules/*
    │       ├── e2e/
    │       ├── resources/    # Insomnia, ERD, drawio
    │       ├── package.json  # derivado de package.app.template.json
    │       ├── tsconfig.json / tsconfig.build.json
    │       └── jest.config.json
    └── libs/
        ├── configs/
        │   └── envs/         # Environments, schemas Joi, carga de .env, certs
        ├── utils/            # tipos comunes, helpers de test/mocks genéricos
        └── dto/              # DTOs/tipos compartidos entre futuras apps
```

---

## 2. Tecnologías a adoptar (tomadas de `trade`)

| Área | Actual | Objetivo | Notas |
|---|---|---|---|
| Package manager / runtime | npm + node | **Bun** (workspaces + catalog) | `workspaces.packages: ["packages/*/**"]` y `catalog:` para versiones compartidas |
| Lint + format | ESLint + Prettier | **Biome** | un solo tool; se eliminan `.eslintrc.js` y `.prettierrc` |
| Versiones de tools | — | **mise** (`.mise.toml`) | fija bun/biome + tareas de gestión de `.env` |
| TypeScript | por app, laxo | **tsconfig.base.json** estricto | `strict`, `nodenext`, `noUncheckedIndexedAccess`, `noEmit` en base; cada paquete extiende |
| Git hooks | — | **husky** | `biome check` en pre-commit |
| Infra local | — | **docker-compose** | postgres por defecto, mysql bajo profile |
| Tests | Jest | Jest (se mantiene en la app api) | igual que la app `api` de trade |
| ORM | TypeORM (pg + mysql) | **TypeORM (se mantiene)** | es parte del valor del template; trade usa drizzle pero eso es lógica propia de ese proyecto |

**Convenciones de imports (de trade):**
- Internos al paquete: `#src/*` (campo `imports` del package.json).
- Entre paquetes: `@<scope>/<paquete>` con `"workspace:*"` (campo `exports` en libs: `"./*": "./src/*.ts"`).
- Extensión `.ts` explícita en imports (Bun ejecuta TS directo, sin build obligatorio).

**Scope propuesto:** `@template/` (ej. `@template/api`, `@template/configs-envs`, `@template/utils`). Al clonar el template, el usuario hace un rename global del scope.

---

## 3. Fases del plan

### Fase 1 — Infraestructura raíz del monorepo
1. Crear `package.json` raíz: `private: true`, `workspaces.packages: ["packages/*/**"]`, `catalog` con versiones compartidas (`typescript`, `@nestjs/common`, `@nestjs/core`, `class-validator`, `rxjs`, `jest`, `ts-jest`, `dotenv`, `joi`, `typeorm`, `pg`, `mysql2`...).
2. Scripts raíz: `biome:check|fix|format|lint`, `apps`, `libs`, `filter`, `base`, `docker:up|down`, `watch:libs`, `prepare` (husky).
3. Crear `bunfig.toml` (install exact, cache, `[run] env = ".env"`).
4. Crear `.mise.toml`: tools `bun` + `biome`, variable `ENV_DIR` apuntando a `packages/libs/configs/envs`, tareas `env:create`, `env:check`, `env:backup`.
5. Crear `tsconfig.base.json` (estricto, nodenext, decoradores para NestJS, `noEmit`) y `tsconfig.json` raíz mínimo.
6. Crear `biome.json` (formatter tabs, linter recommended, ignora `migrations/`, `dist/`, `resources/`).
7. Configurar husky con pre-commit (`biome check`).
8. Actualizar `.gitignore` (bun.lock sí se versiona; `.bun-cache`, `dist`, `*.tsbuildinfo`, `.watch-libs.lock`).
9. Crear `docker-compose.yml` con postgres (default) y mysql (profile `mysql`).
10. Eliminar del root: `.eslintrc.js`, `.prettierrc`, `nest-cli.json`, `jest.config.json`, `tsconfig.build.json`, `package-lock.json` (se mueven o reemplazan según fase 3).

### Fase 2 — Carpeta `templates/` ⭐
Es la pieza clave: base para crear cualquier app o lib nueva del monorepo.

1. `package.app.template.json`: placeholders `[APP_NAME]`, `[APP_DESCRIPTION]`; `type: module`; `imports` con `#src/*` y `#mocks/*`; scripts `start`, `dev` (`bun --watch`/`--hot`), `build`, `clean`, `typecheck`; deps de workspace (`@template/configs-envs`, `@template/utils`, `@template/dto` como `workspace:*`).
2. `package.lib.template.json`: placeholder `[LIB_NAME]`; `exports` (`"./*": "./src/*.ts"`); `imports` `#src/*`; scripts `build`, `clean`, `typecheck` (sin ejecución).
3. `tsconfig.app.template.json` y `tsconfig.lib.template.json`: extienden `../../../tsconfig.base.json`, `include: ["src"]`.
4. `templates/README.md`: documentar convenciones (apps vs libs, imports `#src` vs cross-package, por qué extensiones `.ts`, cómo usar `workspace:*` y `catalog:`), adaptado de trade pero genérico.

### Fase 3 — Migrar la app NestJS actual a `packages/apps/api`
1. Crear `packages/apps/api/` a partir de `package.app.template.json`.
2. Mover `src/` completo (app, database, modules auth/users/profiles/passwords, migrations pg/mysql).
3. Mover `test/` → `packages/apps/api/e2e/` y `resources/` → `packages/apps/api/resources/`.
4. `package.json` de la app: deps NestJS/TypeORM/Passport con `catalog:` donde aplique; scripts del template + `test`, `test:e2e`, `migration:*` (los scripts de TypeORM CLI viven aquí).
5. `tsconfig.json` (extiende base) + `tsconfig.build.json` (con `outDir`, emite) + `jest.config.json` y `nest-cli.json` a nivel de la app.
6. Ajustar imports internos a la convención `#src/*` (o mantener relativos en una primera pasada y migrar después — decisión durante implementación).

### Fase 4 — Extraer libs compartidas mínimas
Solo lo indispensable; el resto queda dentro de la app:

1. `packages/libs/configs/envs` (`@template/configs-envs`): `Environments.ts`, `config.schemas.ts` (Joi), carga de `.env` + `.env.example`, `certs/`. Es el `ENV_DIR` que usa mise.
2. `packages/libs/utils` (`@template/utils`): tipos genéricos (`types.d.ts`), helpers de mocks para tests.
3. `packages/libs/dto` (`@template/dto`): arranca casi vacío (un DTO común de ejemplo, p. ej. paginación) — existe para marcar el patrón de compartir tipos entre apps.
4. Las configs de TypeORM (`typeorm.config.ts`, `pgdb.config.ts`, `mysqldb.config.ts`) **se quedan en la app api** (dependen del ORM de la app), consumiendo `@template/configs-envs`.

### Fase 5 — Scripts del monorepo
1. `scripts/app-runner.ts`: adaptado de trade — ejecuta `bun run --filter ./packages/apps/<pkg>` o `./packages/libs/<pkg>` (comandos raíz `bun apps api start:dev`, `bun libs utils typecheck`).
2. `scripts/create-package.sh` (equivalente al `create-module-structure.sh` de trade): recibe tipo (`app`|`lib`) y nombre, copia los archivos de `templates/`, sustituye placeholders y crea `src/` con un stub mínimo.

### Fase 6 — Documentación y limpieza
1. Reescribir `README.md` raíz: qué es el template, requisitos (mise/bun), quick start (`mise install` → `bun install` → `mise run env:create` → `bun run docker:up` → `bun apps api start:dev`), cómo crear una app/lib nueva desde `templates/`.
2. Crear `docs/MONOREPO.md` (arquitectura y convenciones) y `docs/NAMING-CONVENTIONS.md` (scope, nombres de paquetes `configs-*`, `modules-*`).
3. Mover contenido útil de `Notes.md` a `docs/` o eliminarlo.
4. README corto en `packages/apps/api`.

### Fase 7 — Validación
1. `bun install` limpio desde cero.
2. `bun run biome:check` sin errores.
3. `tsc --noEmit` global (typecheck de todos los paquetes).
4. Tests unitarios y e2e de la app api en verde.
5. Levantar postgres con docker-compose, correr migraciones y arrancar `api` en dev.
6. Probar el generador: crear una lib y una app dummy desde `templates/` y verificar que compilan e importan `@template/utils`.

---

## 4. Qué NO se trae de trade (fuera de alcance)

- Lógica de negocio: analyzer, kafka, redis, ctrader, drizzle, algo-core, indicadores, bots `.cs`.
- Paquetes `libs/api/*` específicos de trade (auth/users como libs separadas) — en el template los módulos viven dentro de la app `api`; el patrón queda documentado por si se quiere extraer después.
- `packages/requests` (httpyac) — **opcional**: podría reemplazar el JSON de Insomnia como colección de requests versionable. Se decide al final; no bloquea nada.
- Docs específicas de trade (DRIZZLEORM, REDIS, estrategias, etc.).

## 5. Decisiones abiertas (a confirmar antes o durante la implementación)

| # | Decisión | Recomendación |
|---|---|---|
| 1 | Scope de paquetes | `@template/` (rename al clonar) |
| 2 | ORM | Mantener TypeORM; no adoptar drizzle |
| 3 | Runtime en dev | Bun directo (`bun --watch src/main.ts`) en lugar de `nest start --watch`; se conserva `@nestjs/cli` solo para schematics |
| 4 | Imports `#src/*` en la app api | Migrarlos en fase 3 o dejar relativos y migrar en un PR posterior |
| 5 | Incluir `packages/requests` (httpyac) | Sí, como reemplazo ligero de Insomnia (opcional) |
| 6 | NestJS 10 → 11 | Aprovechar la migración para subir versión, o mantener 10 y subir después |

## 6. Orden de commits sugerido

1. `chore(monorepo): infraestructura raíz (bun workspaces, biome, mise, tsconfig base)`
2. `feat(templates): plantillas de apps y libs del monorepo`
3. `refactor(api): migrar app NestJS a packages/apps/api`
4. `feat(libs): extraer configs/envs, utils y dto`
5. `feat(scripts): app-runner y generador de paquetes`
6. `docs: README y convenciones del monorepo`
