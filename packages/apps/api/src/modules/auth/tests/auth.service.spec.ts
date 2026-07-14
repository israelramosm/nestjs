import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockJWTService, mockUserRestService } from '@template/utils/tests/mocks/providers.mocks';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import {
	authLoginDto,
	authLoginResult,
	jwtPayload,
	userResult,
} from 'src/utils/tests/mocks/data.mocks';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUserRestService,
				},
				{
					provide: JwtService,
					useValue: mockJWTService,
				},
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});

	it('validateUser => Should validate and return user information', async () => {
		// arrange
		jest.spyOn(mockUserRestService, 'findOneByEmail').mockResolvedValue(userResult);
		jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

		// act
		const result = await authService.validateUser(authLoginDto.email, authLoginDto.password);

		// assert
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...userResultMock } = userResult;

		expect(mockUserRestService.findOneByEmail).toHaveBeenCalled();
		expect(mockUserRestService.findOneByEmail).toHaveBeenCalledWith(authLoginDto.email);

		expect(result).toStrictEqual(userResultMock);
	});

	it('login => should return an access token', async () => {
		//arrange
		jest.spyOn(mockJWTService, 'sign').mockReturnValue(authLoginResult.access_token);

		//act
		const result = await authService.login(authLoginDto);

		// assert
		expect(mockJWTService.sign).toHaveBeenCalled();
		expect(mockJWTService.sign).toHaveBeenCalledWith(jwtPayload);

		expect(result).toEqual(authLoginResult);
	});

	describe('Error', () => {
		it('NotFound => Should validate and return error if the user is not found', async () => {
			// arrange
			jest.spyOn(mockUserRestService, 'findOneByEmail').mockResolvedValue(null);
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

			// act
			const result = authService.validateUser(authLoginDto.email, authLoginDto.password);

			// assert
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			expect(mockUserRestService.findOneByEmail).toHaveBeenCalled();
			expect(mockUserRestService.findOneByEmail).toHaveBeenCalledWith(authLoginDto.email);

			await expect(result).rejects.toEqual(new UnauthorizedException('User not found'));
		});

		it('IncorrectPassword => Should validate and return error the password is incorrect', async () => {
			// arrange
			jest.spyOn(mockUserRestService, 'findOneByEmail').mockResolvedValue(userResult);
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

			// act
			const result = authService.validateUser(authLoginDto.email, authLoginDto.password);

			// assert
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			expect(mockUserRestService.findOneByEmail).toHaveBeenCalled();
			expect(mockUserRestService.findOneByEmail).toHaveBeenCalledWith(authLoginDto.email);

			await expect(result).rejects.toEqual(new UnauthorizedException('Incorrect password'));
		});
	});
});
