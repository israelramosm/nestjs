import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@template/api-redis/redis.module';
import { DatabaseModule } from '@template/configs-database/database.module';
import { ConfigSchemas } from '@template/configs-envs/config.schemas';
import { AuthModule } from '@template/modules-identity/auth/auth.module';
import { UsersModule } from '@template/modules-identity/users/users.module';
import { AppController } from '#src/app.controller';
import { AppService } from '#src/app.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: ConfigSchemas.validations,
		}),
		RedisModule,
		DatabaseModule,
		AuthModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
