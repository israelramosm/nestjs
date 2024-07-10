import { Test, TestingModule } from '@nestjs/testing';
import {
  passwordResult,
  passwordRemovedResult,
  createPasswordDto,
} from 'src/utils/tests/mocks/data.mocks';
import { mockRestService } from 'src/utils/tests/mocks/providers.mocks';
import { PasswordsService } from '../passwords.service';
import { PasswordsController } from '../passwords.controller';

describe('PasswordsController', () => {
  let passwordController: PasswordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordsController],
      providers: [
        {
          provide: PasswordsService,
          useValue: mockRestService,
        },
      ],
    }).compile();

    passwordController = module.get<PasswordsController>(PasswordsController);
  });

  it('should be defined', () => {
    expect(passwordController).toBeDefined();
  });

  it('create => Should create a new password and return its data', async () => {
    // arrange
    jest.spyOn(mockRestService, 'create').mockResolvedValue(passwordResult);

    // act
    const result = await passwordController.create(createPasswordDto);

    // assert
    expect(mockRestService.create).toHaveBeenCalled();
    expect(mockRestService.create).toHaveBeenCalledWith(createPasswordDto);

    expect(result).toStrictEqual(passwordResult);
  });

  it('findAll => should return an array of password', async () => {
    //arrange
    const passwords = [passwordResult];
    jest.spyOn(mockRestService, 'findAll').mockResolvedValue(passwords);

    //act
    const result = await passwordController.findAll();

    // assert
    expect(mockRestService.findAll).toHaveBeenCalled();

    expect(result).toEqual(passwords);
  });

  it('findOneById => should find a password by a given id and return its data', async () => {
    //arrange
    const id = passwordResult.password_id;

    jest
      .spyOn(mockRestService, 'findOneById')
      .mockResolvedValue(passwordResult);

    //act
    const result = await passwordController.findOneById(id);

    // assert
    expect(mockRestService.findOneById).toHaveBeenCalled();
    expect(mockRestService.findOneById).toHaveBeenCalledWith(id);

    expect(result).toEqual(passwordResult);
  });

  it('update => Should update a new password and return its data', async () => {
    // arrange
    const id = passwordResult.password_id;
    jest.spyOn(mockRestService, 'update').mockResolvedValue(passwordResult);

    // act
    const result = await passwordController.update(id, createPasswordDto);

    // assert
    expect(mockRestService.update).toHaveBeenCalled();
    expect(mockRestService.update).toHaveBeenCalledWith(id, createPasswordDto);

    expect(result).toStrictEqual(passwordResult);
  });

  it('remove => should find a password by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = passwordResult.password_id;

    jest
      .spyOn(mockRestService, 'remove')
      .mockResolvedValue(passwordRemovedResult);

    //act
    const result = await passwordController.remove(id);

    // assert
    expect(mockRestService.remove).toHaveBeenCalled();
    expect(mockRestService.remove).toHaveBeenCalledWith(id);

    expect(result).toEqual(passwordRemovedResult);
  });
});
