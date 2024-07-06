import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import { PasswordsService } from 'src/modules/passwords/passwords.service';
import {
  findUserByEmailQuery,
  findUserByUserIdQuery,
} from '../queries/user.queries';
import {
  mockRepository,
  mockRestServiceData,
} from 'src/utils/tests/mocks/providers.mocks';
import {
  createUserDto,
  passwordResult,
  profileResult,
  userCallWith,
  userResult,
} from 'src/utils/tests/mocks/data.mocks';

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: ProfilesService,
          useValue: mockRestServiceData(profileResult),
        },
        {
          provide: PasswordsService,
          useValue: mockRestServiceData(passwordResult),
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    jest.spyOn(mockRepository, 'save').mockReturnValue(userResult);

    // act
    const result = await userService.create(createUserDto);

    // assert
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(userCallWith);

    expect(result).toStrictEqual(userResult);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const users = [userResult];
    jest.spyOn(mockRepository, 'find').mockReturnValue(users);

    //act
    const result = await userService.findAll();

    // assert
    expect(mockRepository.find).toHaveBeenCalled();

    expect(result).toEqual(users);
  });

  it('findOneById => should find a user by a given id and return its data', async () => {
    //arrange
    const id = userResult.user_id;

    jest.spyOn(mockRepository, 'findOne').mockReturnValue(userResult);

    //act
    const result = await userService.findOneById(id);

    // assert
    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith(
      findUserByUserIdQuery(id),
    );

    expect(result).toEqual(userResult);
  });

  it('findOneByUsername => should find a user by a given username and return its data', async () => {
    //arrange
    const email = userResult.email;

    jest.spyOn(mockRepository, 'findOne').mockReturnValue(userResult);

    //act
    const result = await userService.findOneByEmail(email);

    // assert
    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith(
      findUserByEmailQuery(email),
    );

    expect(result).toEqual(userResult);
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = userResult.user_id;

    jest.spyOn(mockRepository, 'delete').mockReturnValue(userResult);

    //act
    const result = await userService.remove(id);

    // assert
    expect(mockRepository.delete).toHaveBeenCalled();
    expect(mockRepository.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(userResult);
  });
});
