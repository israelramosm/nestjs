import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Environments } from '@template/configs-envs/Environments';
import { AuthController } from '#src/auth/auth.controller';
import { AuthService } from '#src/auth/auth.service';
import { JwtAuthGuard } from '#src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '#src/auth/guards/local-auth.guard';
import { JwtStrategy } from '#src/auth/strategies/jwt.strategy';
import { LocalStrategy } from '#src/auth/strategies/local.strategy';
import { PasswordsModule } from '#src/passwords/passwords.module';
import { UsersModule } from '#src/users/users.module';

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
