import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import { mockRepository } from 'src/utils/tests/mocks/providers.mocks';
import {
  createProfileDto,
  profileResult,
} from 'src/utils/tests/mocks/data.mocks';
import { Profile } from '../entities/profile.entity';
import {
  findProfileByProfileIdQuery,
  findProfileByUsernameQuery,
} from '../queries/profile.queries';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProfileService', () => {
  let profileService: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockRepository,
        },
      ],
    }).compile();

    profileService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  it('create => Should create a new profile and return its data', async () => {
    // arrange
    jest.spyOn(mockRepository, 'save').mockReturnValue(profileResult);

    // act
    const result = await profileService.create(createProfileDto);

    // assert
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(createProfileDto);

    expect(result).toStrictEqual(profileResult);
  });

  it('findAll => should return an array of profile', async () => {
    //arrange
    const profiles = [profileResult];
    jest.spyOn(mockRepository, 'find').mockReturnValue(profiles);

    //act
    const result = await profileService.findAll();

    // assert
    expect(mockRepository.find).toHaveBeenCalled();

    expect(result).toEqual(profiles);
  });

  it('findOneById => should find a profile by a given id and return its data', async () => {
    //arrange
    const id = profileResult.profile_id;

    jest.spyOn(mockRepository, 'findOne').mockReturnValue(profileResult);

    //act
    const result = await profileService.findOneById(id);

    // assert
    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith(
      findProfileByProfileIdQuery(id),
    );

    expect(result).toEqual(profileResult);
  });

  it('findOneByUsername => should find a profile by a given username and return its data', async () => {
    //arrange
    const username = profileResult.username;

    jest.spyOn(mockRepository, 'findOne').mockReturnValue(profileResult);

    //act
    const result = await profileService.findOneByUsername(username);

    // assert
    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(mockRepository.findOne).toHaveBeenCalledWith(
      findProfileByUsernameQuery(username),
    );

    expect(result).toEqual(profileResult);
  });

  it('update => Should update a new profile and return its data', async () => {
    // arrange
    const id = profileResult.profile_id;
    jest.spyOn(mockRepository, 'save').mockReturnValue(profileResult);

    // act
    const result = await profileService.update(id, createProfileDto);

    // assert
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(createProfileDto);

    expect(result).toStrictEqual(profileResult);
  });

  it('remove => should find a profile by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = profileResult.profile_id;

    jest.spyOn(mockRepository, 'delete').mockReturnValue(profileResult);

    //act
    const result = await profileService.remove(id);

    // assert
    expect(mockRepository.delete).toHaveBeenCalled();
    expect(mockRepository.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(profileResult);
  });

  describe('Error', () => {
    it('create => Should return a HttpException if username exist', async () => {
      // arrange
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(profileResult);

      // act
      const result = profileService.create(createProfileDto);

      // assert
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalledWith(
        findProfileByUsernameQuery(createProfileDto.username),
      );

      await expect(result).rejects.toEqual(
        new HttpException('Username already exist', HttpStatus.CONFLICT),
      );
    });
  });
});
