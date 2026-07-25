import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Environments } from '@template/configs-envs/Environments';
import { PasswordsModule } from '../passwords/passwords.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		UsersModule,
		PasswordsModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				global: true,
				secret: configService.getOrThrow<string>(Environments.JWT_SECRET),
				signOptions: {
					expiresIn: configService.getOrThrow<number>(Environments.JWT_EXPIRATION),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: LocalAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule {}
