import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import httpsOptions from './config/certs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get('PORT'));
}
bootstrap();
