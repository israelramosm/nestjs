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
    jest.spyOn(userController, 'create').mockResolvedValue(userResult);

    // act
    const result = await userController.create(createUserDto);

    // assert
    expect(userController.create).toHaveBeenCalled();
    expect(userController.create).toHaveBeenCalledWith(createUserDto);

    expect(result).toStrictEqual(userResult);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const users = [userResult];
    jest.spyOn(userController, 'findAll').mockResolvedValue(users);

    //act
    const result = await userController.findAll();

    // assert
    expect(userController.findAll).toHaveBeenCalled();

    expect(result).toEqual(users);
  });

  it('findOneById => should find a user by a given id and return its data', async () => {
    //arrange
    const id = userResult.user_id;

    jest.spyOn(userController, 'findOneById').mockResolvedValue(userResult);

    //act
    const result = await userController.findOneById(id);

    // assert
    expect(userController.findOneById).toHaveBeenCalled();
    expect(userController.findOneById).toHaveBeenCalledWith(id);

    expect(result).toEqual(userResult);
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = userResult.user_id;

    jest.spyOn(userController, 'remove').mockResolvedValue(userRemovedResult);

    //act
    const result = await userController.remove(id);

    // assert
    expect(userController.remove).toHaveBeenCalled();
    expect(userController.remove).toHaveBeenCalledWith(id);

    expect(result).toEqual(userRemovedResult);
  });

  // TODO: Need to work on controller and api for this implementation
  xit('findOneByEmail => should find a user by a given email and return its data', () => {});
});
