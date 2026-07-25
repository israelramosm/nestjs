# @template/api-redis

Módulo global de Redis para NestJS basado en [`ioredis`](https://github.com/redis/ioredis),
configurado desde envs. Usa `lazyConnect`: no se conecta en el arranque, sino en
el primer comando, así la app puede iniciar sin un Redis disponible.

## Exports

Los subpaths se consumen como `@template/api-redis/<archivo>`.

| Subpath                         | Exporta                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| `@template/api-redis/redis.module`    | `RedisModule` — módulo `@Global()` de NestJS.           |
| `@template/api-redis/redis.service`   | `RedisService` — helpers `get`/`set`/`del`/`getClient`. |
| `@template/api-redis/redis.constants` | `REDIS_CLIENT` — token de inyección del cliente `Redis`. |

El módulo provee y exporta tanto `REDIS_CLIENT` (instancia de `ioredis`) como
`RedisService`.

## Variables de entorno

| Variable         | Descripción                          | Default |
| ---------------- | ------------------------------------ | ------- |
| `REDIS_HOST`     | Host del servidor Redis              | —       |
| `REDIS_PORT`     | Puerto del servidor Redis            | —       |
| `REDIS_PASSWORD` | Contraseña (opcional)                | —       |
| `REDIS_DB`       | Índice de la base de datos           | `0`     |

## Uso

Cablea el módulo global en el `AppModule` (basta una vez):

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@template/api-redis/redis.module';

@Module({
	imports: [RedisModule],
})
export class AppModule {}
```

Inyecta `RedisService` en cualquier provider:

```ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@template/api-redis/redis.service';

@Injectable()
export class CacheService {
	constructor(private readonly redis: RedisService) {}

	async remember(key: string, value: string): Promise<void> {
		await this.redis.set(key, value, 60); // TTL de 60s (opcional)
	}

	async lookup(key: string): Promise<string | null> {
		return this.redis.get(key);
	}
}
```

Si necesitas la instancia cruda de `ioredis`, inyecta el token `REDIS_CLIENT` o
usa `redis.getClient()`.
