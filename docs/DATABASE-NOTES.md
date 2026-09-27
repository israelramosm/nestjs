# Base de datos y migraciones

Toda la configuración de base de datos vive en `@template/configs-database`
(`packages/libs/configs/database`): los datasources de Postgres y MySQL, el
`DatabaseModule` que consume la app, y las migraciones de cada motor.

## Levantar los servicios

Los contenedores los define `docker-compose.yml` en la raíz. Postgres y Redis
arrancan por defecto; MySQL y Kafka están detrás de un profile.

```bash
bun run docker:up                      # postgres + redis
docker compose --profile mysql up -d   # agrega mysql
bun run docker:down
```

Ojo con las credenciales: son **dos fuentes distintas**. La app lee el `.env`
de `@template/configs-envs` (`packages/libs/configs/envs/.env`, lo crea
`mise run env:create`). El compose no lo lee —no tiene `env_file` y no hay
`.env` en la raíz—, así que usa sus propios defaults (`postgres`/`postgres`,
base `app`). Si cambiás uno sin el otro, la app levanta el contenedor y después
no puede autenticarse contra él.

## Migraciones

Los scripts viven en el `package.json` de la app, porque el CLI de TypeORM
necesita la datasource **y** las entidades, y las entidades son de la app:
`src/config/typeorm.config.ts` las lista de forma explícita. Las tareas de mise
los envuelven y arman la ruta de destino por ti.

```bash
# primera vez, o después de traer migraciones nuevas
mise run migration:run

# generar una migración a partir del diff contra las entidades (requiere DB viva)
mise run migration:generate <Nombre>

# crear una migración vacía, para SQL a mano (no necesita DB)
mise run migration:create <Nombre>

mise run migration:revert
```

El destino es `packages/libs/configs/database/src/migrations/pg/` por defecto.
Con `--driver mysql` va a `mysql/`.

Con `POSTGRES_RUN_MIGRATIONS=true` en el `.env`, las migraciones pendientes
corren solas al arrancar la app.

## Dos cosas que muerden

- **El índice de migraciones se mantiene a mano.** Cada carpeta
  (`migrations/pg`, `migrations/mysql`) tiene un `index.ts` que las importa y
  las lista; el datasource lee esa lista, no el disco. Una migración que
  generaste y no agregaste al índice no corre, y nada avisa.
- **`migration:create` no pasa por la datasource.** Cuelga del script `typeorm`
  en vez de `typeorm:cli`, porque ese subcomando rechaza el flag `-d`. Los otros
  tres sí la necesitan.

## Entidades

El `DatabaseModule` usa `autoLoadEntities: true`, así que las entidades salen de
los `TypeOrmModule.forFeature()` de cada módulo de Nest, no de un glob sobre el
filesystem. El CLI no ve ese registro —solo existe dentro de Nest—, por eso
`typeorm.config.ts` repite la lista a mano. Entidad nueva: va al `forFeature()`
de su módulo y a esa lista.

## Referencia

- [TypeORM CLI](https://orkhan.gitbook.io/typeorm/docs/using-cli)
