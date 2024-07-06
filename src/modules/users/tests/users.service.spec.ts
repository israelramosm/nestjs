import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { createUserDto, password, profile, userCallWith, userResult } from './mocks';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import { PasswordsService } from 'src/modules/passwords/passwords.service';

describe('UsersService', () => {
  let userService: UsersService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

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
          useValue: {
            create: jest.fn().mockResolvedValue(profile),
            findAll: jest.fn().mockResolvedValue([profile]),
            findOneById: jest.fn().mockResolvedValue(profile),
            update: jest.fn().mockResolvedValue(profile),
            remove: jest.fn().mockResolvedValue(profile),
          },
        },
        {
          provide: PasswordsService,
          useValue: {
            create: jest.fn().mockResolvedValue(password),
            findAll: jest.fn().mockResolvedValue([password]),
            findOneById: jest.fn().mockResolvedValue(password),
            update: jest.fn().mockResolvedValue(password),
            remove: jest.fn().mockResolvedValue(password),
          },
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

  xit('findAll => should return an array of user', async () => {
    //arrange
    const users = [userResult];
    jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

    //act
    const result = await userService.findAll();

    // assert
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  xit('findOne => should find a user by a given id and return its data', async () => {
    //arrange
    const id = 'uuid';

    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(userResult);

    //act
    const result = await userService.findOneById(id);

    expect(result).toEqual(userResult);
    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  });

  xit('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    const id = 'uuid';

    jest.spyOn(mockUserRepository, 'delete').mockReturnValue(userResult);

    //act
    const result = await userService.remove(id);

    expect(result).toEqual(userResult);
    expect(mockUserRepository.delete).toHaveBeenCalled();
    expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
  });
});
