import { Test, TestingModule } from '@nestjs/testing';
import {
  authLoginDto,
  authLoginResult,
  userResult,
} from 'src/utils/tests/mocks/data.mocks';
import { AuthService } from '../auth.service';
import { mockAuthService } from 'src/utils/tests/mocks/providers.mocks';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('validateUser => Should create a new profile and return its data', async () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResultMock } = userResult;
    jest.spyOn(mockAuthService, 'validateUser').mockReturnValue(userResultMock);

    // act
    const result = await authService.validateUser(
      authLoginDto.email,
      authLoginDto.password,
    );

    // assert

    expect(mockAuthService.validateUser).toHaveBeenCalled();
    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      authLoginDto.email,
      authLoginDto.password,
    );

    expect(result).toStrictEqual(userResultMock);
  });

  it('login => should return an array of profile', async () => {
    //arrange
    jest.spyOn(mockAuthService, 'login').mockReturnValue(authLoginResult);

    //act
    const result = await authService.login(authLoginDto);

    // assert
    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockAuthService.login).toHaveBeenCalledWith(authLoginDto);

    expect(result).toEqual(authLoginResult);
  });
});
