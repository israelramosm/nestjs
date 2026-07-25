import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import {
	createMockJWTService,
	createMockUserRestService,
} from '@template/utils/tests/mocks/providers.mocks';
import * as bcrypt from 'bcrypt';
import { UsersService } from '#src/modules/users/users.service';
import {
	authLoginDto,
	authLoginResult,
	jwtPayload,
	userResult,
} from '#src/utils/tests/mocks/data.mocks';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
	let authService: AuthService;
	let usersService: ReturnType<typeof createMockUserRestService>;
	let jwtService: ReturnType<typeof createMockJWTService>;

	beforeEach(async () => {
		usersService = createMockUserRestService();
		jwtService = createMockJWTService();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UsersService, useValue: usersService },
				{ provide: JwtService, useValue: jwtService },
			],
		}).compile();

		authService = module.get(AuthService);
	});

	afterEach(() => {
		mock.restore();
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});

	it('validateUser => Should validate and return user information', async () => {
		usersService.findOneByEmail.mockResolvedValue(userResult);
		spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

		const result = await authService.validateUser(authLoginDto.email, authLoginDto.password);

		const { password, ...userResultMock } = userResult;

		expect(usersService.findOneByEmail).toHaveBeenCalledWith(authLoginDto.email);
		expect(result).toStrictEqual(userResultMock);
	});

	it('login => should return an access token', async () => {
		usersService.findOneByEmail.mockResolvedValue(userResult);
		spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
		jwtService.sign.mockReturnValue(authLoginResult.access_token);

		const result = await authService.login(authLoginDto);

		expect(jwtService.sign).toHaveBeenCalledWith(jwtPayload);
		expect(result).toEqual(authLoginResult);
	});

	describe('Error', () => {
		it('NotFound => Should throw if the user is not found', async () => {
			usersService.findOneByEmail.mockResolvedValue(null);
			spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

			const result = authService.validateUser(authLoginDto.email, authLoginDto.password);

			await expect(result).rejects.toEqual(new UnauthorizedException('User not found'));
			expect(usersService.findOneByEmail).toHaveBeenCalledWith(authLoginDto.email);
		});

		it('IncorrectPassword => Should throw if the password is incorrect', async () => {
			usersService.findOneByEmail.mockResolvedValue(userResult);
			spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

			const result = authService.validateUser(authLoginDto.email, authLoginDto.password);

			await expect(result).rejects.toEqual(new UnauthorizedException('Incorrect password'));
			expect(usersService.findOneByEmail).toHaveBeenCalledWith(authLoginDto.email);
		});
	});
});
