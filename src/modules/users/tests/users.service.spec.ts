import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { createUserDto, userCallWith, userResult } from './mocks/data.mocks';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import { PasswordsService } from 'src/modules/passwords/passwords.service';
import { findUserByUserIdQuery } from '../queries/user.queries';
import {
  mockPasswordService,
  mockProfileService,
  mockUserRepository,
} from './mocks/providers.mocks';

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ProfilesService,
          useValue: mockProfileService,
        },
        {
          provide: PasswordsService,
          useValue: mockPasswordService,
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
    jest.spyOn(mockUserRepository, 'save').mockReturnValue(userResult);

    // act
    const result = await userService.create(createUserDto);

    // assert
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(userCallWith);

    expect(result).toStrictEqual(userResult);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const users = [userResult];
    jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

    //act
    const result = await userService.findAll();

    // assert
    expect(mockUserRepository.find).toHaveBeenCalled();

    expect(result).toEqual(users);
  });

  it('findOne => should find a user by a given id and return its data', async () => {
    //arrange
    const id = userResult.user_id;

    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(userResult);

    //act
    const result = await userService.findOneById(id);

    // assert
    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(
      findUserByUserIdQuery(id),
    );

    expect(result).toEqual(userResult);
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = userResult.user_id;

    jest.spyOn(mockUserRepository, 'delete').mockReturnValue(userResult);

    //act
    const result = await userService.remove(id);

    // assert
    expect(mockUserRepository.delete).toHaveBeenCalled();
    expect(mockUserRepository.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(userResult);
  });
});
