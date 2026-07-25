import '@template/configs-envs/load-env';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getHttpsOptions } from '@template/configs-envs/certs';
import { AppModule } from './app.module';

async function bootstrap() {
	const httpsOptions = getHttpsOptions();
	const app = await NestFactory.create(AppModule, httpsOptions ? { httpsOptions } : {});
	const configService = app.get(ConfigService);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
