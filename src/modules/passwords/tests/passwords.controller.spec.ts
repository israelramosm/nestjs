import { Test, TestingModule } from '@nestjs/testing';
import {
  passwordResult,
  passwordRemovedResult,
  createPasswordDto,
} from '../../../utils/tests/mocks/data.mocks';
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
    jest.spyOn(passwordController, 'create').mockResolvedValue(passwordResult);

    // act
    const result = await passwordController.create(createPasswordDto);

    // assert
    expect(passwordController.create).toHaveBeenCalled();
    expect(passwordController.create).toHaveBeenCalledWith(createPasswordDto);

    expect(result).toStrictEqual(passwordResult);
  });

  it('findAll => should return an array of password', async () => {
    //arrange
    const passwords = [passwordResult];
    jest.spyOn(passwordController, 'findAll').mockResolvedValue(passwords);

    //act
    const result = await passwordController.findAll();

    // assert
    expect(passwordController.findAll).toHaveBeenCalled();

    expect(result).toEqual(passwords);
  });

  it('findOneById => should find a password by a given id and return its data', async () => {
    //arrange
    const id = passwordResult.password_id;

    jest
      .spyOn(passwordController, 'findOneById')
      .mockResolvedValue(passwordResult);

    //act
    const result = await passwordController.findOneById(id);

    // assert
    expect(passwordController.findOneById).toHaveBeenCalled();
    expect(passwordController.findOneById).toHaveBeenCalledWith(id);

    expect(result).toEqual(passwordResult);
  });

  it('remove => should find a password by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = passwordResult.password_id;

    jest
      .spyOn(passwordController, 'remove')
      .mockResolvedValue(passwordRemovedResult);

    //act
    const result = await passwordController.remove(id);

    // assert
    expect(passwordController.remove).toHaveBeenCalled();
    expect(passwordController.remove).toHaveBeenCalledWith(id);

    expect(result).toEqual(passwordRemovedResult);
  });
});
