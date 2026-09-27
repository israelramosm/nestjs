# Plan

Estado al 2026-09-27: `bun audit` en cero, typecheck / tests / biome en verde.
Hay un diff sin commitear (tooling bun+biome, vulnerabilidades, salida de
`@nestjs/cli`).

## 0. Commitear lo que ya está hecho

- [ ] Commit de tooling: bun 1.4.2, biome 2.5.14 + config migrada a v2.
- [ ] Commit de seguridad: overrides (`qs`, `multer`, `brace-expansion`),
      `joi` y `mysql2` al día, salida de `@nestjs/cli` + `@nestjs/schematics`
      + `ts-loader`, build de la api con `tsc -p tsconfig.build.json`.

Trampa nueva del repo: **`bun update` destruye las referencias `catalog:`**
(convierte `"typescript": "catalog:"` en una versión literal). Subir versiones
a mano.

## 1. Arreglar el descubrimiento de entidades

`packages/apps/api/src/config/pgdb.config.ts` busca entidades y migraciones con
globs de filesystem sobre `__dirname`. Funciona con `tsc` porque `dist/`
conserva la estructura, pero es un bug latente: si el build bundlea, la ruta
queda hardcodeada a la máquina del build.

- [ ] Entidades: `autoLoadEntities: true` de `@nestjs/typeorm` (las toma de los
      `forFeature()` de cada módulo, no del disco).
- [ ] Migraciones: un `index.ts` que las liste e importe explícitamente.

Va primero porque la reestructuración mueve entidades entre paquetes y
volvería a tocar justo esto.

## 2. CI

No existe workflow. Es el momento de congelar el estado limpio, antes de mover
archivos.

- [ ] `bun run typecheck`
- [ ] `bun run --filter '@template/api' test`
- [ ] `bun run biome:check`
- [ ] `bun audit`

## 3. Reestructurar los paquetes

Decisión previa, hay que tomarla antes de mover nada: `tsconfig.base.json`
tiene `noEmit: true` y las libs lo heredan, así que su script `build` no emite
nada. O las libs se consumen por fuente y se borran esos scripts, o compilan de
verdad y cada tsconfig de lib sobreescribe `noEmit`. Hoy el script existe y
miente.

- [ ] `@template/configs-database` — sacar `database/` y los `*db.config.ts` de
      la api. El corte más claro, y el que más gana cuando entre la segunda app.
- [ ] `@template/api-identity` — auth + users + profiles + passwords en **un
      solo** paquete. No cuatro: las entidades `User`, `Password` y `Profile` se
      importan en ambos sentidos, y partirlas daría dependencias circulares
      entre paquetes del workspace.
- [ ] `@template/shared` — consolidar `dto` + `interfaces` + `utils`, y meter
      ahí `common/` (constantes y el decorador `Public`).

Criterio: un paquete se justifica cuando lo consume más de una app, o cuando
querés versionarlo aparte.

## 4. Limpieza chica

- [ ] `console.log(pgdbConfig)` en `config/typeorm.config.ts` — imprime la
      config de la base, password incluido, en cada corrida del CLI.
- [ ] 5 `private readonly logger` declarados y nunca usados en `modules/auth`
      (biome los reporta como warning).
- [ ] `source-map-support` y `tsconfig-paths` en las devDeps de la api:
      quedaron muertos al salir el CLI de Nest.
- [ ] `concurrently` en las devDeps del root: ningún script lo usa.
- [ ] `docs/DATABASE-NOTES.md` y `docs/MONOREPO.md` describen un repo que ya no
      existe (podman, `npm run migration:*`, Jest, `jest.config.json`).

## 5. Majors pendientes

Ninguno es de seguridad. De a uno, y no mezclar con el punto 3.

- [ ] NestJS 11 → 12
- [ ] TypeORM 0.3 → 1.1 (el de más riesgo)
- [ ] joi 17 → 18, ioredis 5 → 6, dotenv 16 → 18, uuid 11 → 14
- [ ] `@types/node` 20 → 26
- [ ] TypeScript 5 → 7

## 6. Build con `bun build` (opcional, al final)

Probado y funciona: bundlea en ~150 ms y Nest resuelve toda la inyección (Bun
sí aplica `emitDecoratorMetadata`). Condiciones:

- Necesita una lista fija de `--external` para los `require()` condicionales de
  NestJS (`@grpc/grpc-js`, `mqtt`, `nats`, `amqplib`,
  `class-transformer/storage`, etc.).
- El `tsconfig.json` **sigue siendo entrada del build**, no config de editor:
  Bun lee `experimentalDecorators` y `emitDecoratorMetadata` de ahí. Sin eso el
  bundle sale sin metadata y la inyección se cae.
- Se pierden los `.d.ts`. Hoy no importa (las libs se consumen por fuente).
- Requiere el punto 1 hecho.
