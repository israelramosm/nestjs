import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@template/api-redis/redis.module';
import { ConfigSchemas } from '@template/configs-envs/config.schemas';
import { AppController } from '#src/app.controller';
import { AppService } from '#src/app.service';
import { DatabaseModule } from '#src/database/database.module';
import { AuthModule } from '#src/modules/auth/auth.module';
import { UsersModule } from '#src/modules/users/users.module';

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
