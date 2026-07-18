import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '#src/redis.constants';
import { RedisService } from '#src/redis.service';

/**
 * Modulo global de Redis. Usa `lazyConnect` para NO conectarse en el arranque:
 * la conexion se abre en el primer comando, de modo que la app puede iniciar
 * sin un Redis disponible.
 */
@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: REDIS_CLIENT,
			inject: [ConfigService],
			useFactory: (config: ConfigService) =>
				new Redis({
					host: config.get<string>('REDIS_HOST'),
					port: config.get<number>('REDIS_PORT'),
					password: config.get<string>('REDIS_PASSWORD') || undefined,
					db: config.get<number>('REDIS_DB') ?? 0,
					lazyConnect: true,
					maxRetriesPerRequest: null,
				}),
		},
		RedisService,
	],
	exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
