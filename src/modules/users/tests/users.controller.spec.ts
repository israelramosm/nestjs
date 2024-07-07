import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import {
  createUserDto,
  userRemovedResult,
  userResult,
} from '../../../utils/tests/mocks/data.mocks';
import { mockUserRestService } from '../../../utils/tests/mocks/providers.mocks';
import { UsersController } from '../users.controller';

describe('UsersController', () => {
  let userController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserRestService,
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    jest.spyOn(mockUserRestService, 'create').mockResolvedValue(userResult);

    // act
    const result = await userController.create(createUserDto);

    // assert
    expect(mockUserRestService.create).toHaveBeenCalled();
    expect(mockUserRestService.create).toHaveBeenCalledWith(createUserDto);

    expect(result).toStrictEqual(userResult);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const users = [userResult];
    jest.spyOn(mockUserRestService, 'findAll').mockResolvedValue(users);

    //act
    const result = await userController.findAll();

    // assert
    expect(mockUserRestService.findAll).toHaveBeenCalled();

    expect(result).toEqual(users);
  });

  it('findOneById => should find a user by a given id and return its data', async () => {
    //arrange
    const id = userResult.user_id;

    jest
      .spyOn(mockUserRestService, 'findOneById')
      .mockResolvedValue(userResult);

    //act
    const result = await userController.findOneById(id);

    // assert
    expect(mockUserRestService.findOneById).toHaveBeenCalled();
    expect(mockUserRestService.findOneById).toHaveBeenCalledWith(id);

    expect(result).toEqual(userResult);
  });

  it('update => Should update a new user and return its data', async () => {
    // arrange
    const id = userResult.user_id;
    jest.spyOn(mockUserRestService, 'update').mockResolvedValue(userResult);

    // act
    const result = await userController.update(id, createUserDto);

    // assert
    expect(mockUserRestService.update).toHaveBeenCalled();
    expect(mockUserRestService.update).toHaveBeenCalledWith(id, createUserDto);

    expect(result).toStrictEqual(userResult);
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = userResult.user_id;

    jest
      .spyOn(mockUserRestService, 'remove')
      .mockResolvedValue(userRemovedResult);

    //act
    const result = await userController.remove(id);

    // assert
    expect(mockUserRestService.remove).toHaveBeenCalled();
    expect(mockUserRestService.remove).toHaveBeenCalledWith(id);

    expect(result).toEqual(userRemovedResult);
  });

  // TODO: Need to work on controller and api for this implementation
  xit('findOneByEmail => should find a user by a given email and return its data', () => {});
});
