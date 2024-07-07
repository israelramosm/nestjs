import { Test, TestingModule } from '@nestjs/testing';
import {
  authLoginDto,
  authLoginResult,
  authProfileResult,
  reqAuthProfile,
} from '../../../utils/tests/mocks/data.mocks';
import { mockAuthService } from 'src/utils/tests/mocks/providers.mocks';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('login => Should login a new user and return its data', async () => {
    // arrange
    jest.spyOn(mockAuthService, 'login').mockResolvedValue(authLoginResult);

    // act
    const result = await authController.login(authLoginDto);

    // assert
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockAuthService.login).toHaveBeenCalledWith(authLoginDto);

    expect(result).toStrictEqual(authLoginResult);
  });

  it('getProfile => Should return user from request', async () => {
    //act
    const result = await authController.getProfile(reqAuthProfile);

    // assert
    expect(result).toEqual(authProfileResult);
  });
});
