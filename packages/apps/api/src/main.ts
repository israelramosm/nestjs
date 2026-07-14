import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import httpsOptions from '@template/configs-envs/certs';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { httpsOptions });
	const configService = app.get(ConfigService);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	await app.listen(configService.get('PORT'));
}
bootstrap();
