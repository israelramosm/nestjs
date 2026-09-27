# nestjs (template)

## Usarlo como plantilla

Al clonar para un proyecto nuevo:

1. Rename global del scope `@template/` (paquetes, imports, `package.json` de
   cada app/lib) — no hay script para esto, es búsqueda y reemplazo manual.
2. `mise run env:create` (o `cp packages/libs/configs/envs/.env.example
   packages/libs/configs/envs/.env`) y ajustar valores.
3. Nueva app/lib: `scripts/create-package.sh app <nombre> "<desc>"` o
   `scripts/create-package.sh lib <nombre>`, luego `bun install`. El script
   copia `templates/*.template.json` y reemplaza `[APP_NAME]`/`[LIB_NAME]`.

## Comandos reales

```sh
mise install && bun install        # setup
bun run docker:up                  # postgres siempre; mysql/kafka con --profile
mise run dev api                   # equivalente: bun run --filter '@template/api' dev
bun run --filter '@template/api' test        # unit (bun test, mockea repos, sin DB)
bun run --filter '@template/api' test:e2e    # requiere DB activa
bun run typecheck                  # tsc --noEmit en todos los paquetes
bun run biome:check / biome:fix    # lint+format (reemplaza ESLint+Prettier)
bun run --filter '@template/api' migration:generate ../../libs/configs/database/src/migrations/pg/<Nombre>
```

No hay `build` global necesario para desarrollar: Bun corre `src/main.ts`
directo. `nest build` (`bun run --filter '@template/api' build`) solo hace
falta para `dist/`.

## Arquitectura

`packages/apps/api` es la única app de ejemplo (auth/users/profiles vía
TypeORM+Passport). `packages/libs/**` son libs sin lógica de arranque
consumidas via `@template/<pkg>` + `workspace:*` (ver
`docs/NAMING-CONVENTIONS.md` para el mapeo carpeta→nombre de paquete, p. ej.
`libs/configs/envs` → `@template/configs-envs`). Todo lo demás
(`templates/`, `scripts/create-package.sh`) existe solo para generar
paquetes nuevos con esa misma convención.

## Trampas conocidas

- **HTTPS "silencioso"**: si `packages/libs/configs/envs/src/certs/{key,cert}.pem`
  existen (gitignored, no versionados), la app arranca en HTTPS aunque no lo
  hayas pedido. Forzar HTTP con `HTTPS_ENABLED=false`.
- **`docs/DATABASE-NOTES.md` está desactualizado**: son notas personales
  viejas (podman, `npm run migration:*`, Jest). Los comandos reales del
  template usan `bun run --filter '@template/api' migration:*` (ver
  scripts en `packages/apps/api/package.json`) y `bun test`, no Jest — no lo
  sigas al pie de la letra.
- **`docs/MONOREPO.md` menciona `jest.config.json`** en el árbol de la app;
  ya no existe, los tests corren con el runner nativo de Bun.
- Imports cross-package van **sin** extensión (`@template/dto/pagination.dto`):
  el `exports` map de cada paquete (`"./*"` → `"./src/*.ts"`) la agrega. Con
  `.ts` explícito el typecheck falla con TS2307.
- El script `create-package.sh` no corre `bun install` por ti ni agrega la
  dependencia `workspace:*` en el consumidor — son pasos manuales después.
