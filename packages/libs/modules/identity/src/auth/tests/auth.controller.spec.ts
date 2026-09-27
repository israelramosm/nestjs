import { beforeEach, describe, expect, it } from 'bun:test';
import { Test, type TestingModule } from '@nestjs/testing';
import { createMockAuthService } from '@template/shared/tests/mocks/providers.mocks';
import { AuthController } from '#src/auth/auth.controller';
import { AuthService } from '#src/auth/auth.service';
import {
	authLoginDto,
	authLoginResult,
	authProfileResult,
	reqAuthProfile,
} from '#src/tests/mocks/data.mocks';

describe('AuthController', () => {
	let authController: AuthController;
	let authService: ReturnType<typeof createMockAuthService>;

	beforeEach(async () => {
		authService = createMockAuthService();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: authService }],
		}).compile();

		authController = module.get(AuthController);
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	it('login => Should login a user and return its data', async () => {
		authService.login.mockResolvedValue(authLoginResult);

		const result = await authController.login(authLoginDto);

		expect(authService.login).toHaveBeenCalledWith(authLoginDto);
		expect(result).toStrictEqual(authLoginResult);
	});

	it('getProfile => Should return user from request', async () => {
		const result = await authController.getProfile(reqAuthProfile);

		expect(result).toEqual(authProfileResult);
	});
});
