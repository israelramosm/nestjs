# nestjs (template)

## Usarlo como plantilla

Al clonar para un proyecto nuevo:

1. Rename global del scope `@template/` (paquetes, imports, `package.json` de
   cada app/lib) — no hay script para esto, es búsqueda y reemplazo manual.
2. `mise run env:create` (o `cp packages/libs/configs/envs/.env.example
   packages/libs/configs/envs/.env`) y ajustar valores.
3. Nueva app/lib: `mise run new:app <nombre> "<desc>"` o
   `mise run new:lib <nombre>`. Envuelve `scripts/create-package.sh` (copia
   `templates/*.template.json`, reemplaza `[APP_NAME]`/`[LIB_NAME]`) y corre
   `bun install`.

## Comandos reales

mise es el entry point: `mise tasks` lista todo con descripción. Cada task
delega en un script de `package.json` — esos scripts son la implementación
(`bun run --filter` los necesita para el grafo de workspaces), no la interfaz.
Donde una task acepta `[pkg]`, sin argumento corre en todo el monorepo y con
argumento en un paquete, por nombre corto (`api`, `modules-identity`) o
completo (`@template/api`).

```sh
mise install && mise run setup     # bun + deps + git hooks
mise run docker:up                 # postgres siempre; mysql/kafka con --profile
mise run dev api                   # app en watch
mise run test                      # unit de todos los paquetes (bun test, sin DB)
mise run test modules-identity     # solo auth/users/profiles
mise run test:e2e api              # requiere DB activa
mise run typecheck                 # tsc --noEmit en todos los paquetes
mise run check / fix               # lint+format con Biome (reemplaza ESLint+Prettier)
mise run migration:generate <Nombre>   # --driver mysql para la otra carpeta
mise run ci                        # reproduce el workflow de CI en local
```

No hay `build` global necesario para desarrollar: Bun corre `src/main.ts`
directo. `mise run build api` (`tsc -p tsconfig.build.json`) solo hace falta
para `dist/`.

## Arquitectura

`packages/apps/api` es la única app de ejemplo, y quedó chica: solo arranque,
health check y la datasource del CLI de TypeORM. La identidad
(auth/users/profiles/passwords vía TypeORM+Passport) vive en
`@template/modules-identity`, y la config de base de datos en
`@template/configs-database`. `packages/libs/**` son libs sin lógica de arranque
consumidas via `@template/<pkg>` + `workspace:*` (ver
`docs/NAMING-CONVENTIONS.md` para el mapeo carpeta→nombre de paquete, p. ej.
`libs/configs/envs` → `@template/configs-envs`). Todo lo demás
(`templates/`, `scripts/create-package.sh`) existe solo para generar
paquetes nuevos con esa misma convención.

## Trampas conocidas

- **HTTPS "silencioso"**: si `packages/libs/configs/envs/src/certs/{key,cert}.pem`
  existen (gitignored, no versionados), la app arranca en HTTPS aunque no lo
  hayas pedido. Forzar HTTP con `HTTPS_ENABLED=false`.
- Imports cross-package van **sin** extensión (`@template/shared/dto/pagination.dto`):
  el `exports` map de cada paquete (`"./*"` → `"./src/*.ts"`) la agrega. Con
  `.ts` explícito el typecheck falla con TS2307.
- `mise run new:app`/`new:lib` sí corren `bun install`, pero **no** agregan la
  dependencia `workspace:*` en el consumidor — ese paso sigue siendo manual.
- **Las plantillas no traen script `test`, a propósito**: `bun test` sale con
  código 1 si no encuentra archivos de test, así que un paquete nuevo con ese
  script rompería `mise run test` y el CI del repo. Agrégalo
  (`"test": "bun test src"`) al escribir el primer test. Hasta entonces
  `mise run test <pkg>` falla con "Script not found", pero `mise run test` a
  secas ignora el paquete.
- **Los git hooks no se activan al clonar**: `git config core.hooksPath` es
  config local, no viaja con el repo. Hay que correr `mise run setup` (o
  `mise run hooks`) una vez. El `pre-commit` de `.githooks/` se salta a sí mismo
  si `mise` no está en el PATH, para no romper commits desde clientes gráficos.
