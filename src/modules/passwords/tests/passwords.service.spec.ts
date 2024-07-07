import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from 'src/utils/tests/mocks/providers.mocks';
import {
  createPasswordDto,
  passwordResult,
} from 'src/utils/tests/mocks/data.mocks';
import { PasswordsService } from '../passwords.service';
import { Password } from '../entities/password.entity';
import { findPasswordByPasswordIdQuery } from '../queries/password.queries';
import * as bcrypt from 'bcrypt';

describe('PasswordsService', () => {
  let passwordsService: PasswordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordsService,
        {
          provide: getRepositoryToken(Password),
          useValue: mockRepository,
        },
      ],
    }).compile();

    passwordsService = module.get<PasswordsService>(PasswordsService);
  });

  it('should be defined', () => {
    expect(passwordsService).toBeDefined();
  });

  it('create => Should create a new profile and return its data', async () => {
    // arrange
    jest.spyOn(mockRepository, 'save').mockReturnValue(passwordResult);
    jest.spyOn(bcrypt, 'hash').mockReturnValue(createPasswordDto.password);

    // act
    const result = await passwordsService.create(createPasswordDto);

    // assert

    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(createPasswordDto);

    expect(result).toStrictEqual(passwordResult);
  });

  it('findAll => should return an array of profile', async () => {
    //arrange
    const profiles = [passwordResult];
    jest.spyOn(mockRepository, 'find').mockReturnValue(profiles);

    //act
    const result = await passwordsService.findAll();

    // assert
    expect(mockRepository.find).toHaveBeenCalled();

    expect(result).toEqual(profiles);
  });

  it('findOneById => should find a profile by a given id and return its data', async () => {
    //arrange
    const id = passwordResult.password_id;

    jest.spyOn(mockRepository, 'findOne').mockReturnValue(passwordResult);

    //act
    const result = await passwordsService.findOneById(id);

    // assert
    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith(
      findPasswordByPasswordIdQuery(id),
    );

    expect(result).toEqual(passwordResult);
  });

  it('remove => should find a profile by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = passwordResult.password_id;

    jest.spyOn(mockRepository, 'delete').mockReturnValue(passwordResult);

    //act
    const result = await passwordsService.remove(id);

    // assert
    expect(mockRepository.delete).toHaveBeenCalled();
    expect(mockRepository.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(passwordResult);
  });
});
