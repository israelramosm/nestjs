import { Test, TestingModule } from '@nestjs/testing';
import {
  profileResult,
  profileRemovedResult,
  createProfileDto,
} from '../../../utils/tests/mocks/data.mocks';
import { ProfileController } from '../profiles.controller';
import { mockRestService } from 'src/utils/tests/mocks/providers.mocks';
import { ProfilesService } from '../profiles.service';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfilesService,
          useValue: mockRestService,
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(profileController).toBeDefined();
  });

  it('create => Should create a new profile and return its data', async () => {
    // arrange
    jest.spyOn(mockRestService, 'create').mockResolvedValue(profileResult);

    // act
    const result = await profileController.create(createProfileDto);

    // assert
    expect(mockRestService.create).toHaveBeenCalled();
    expect(mockRestService.create).toHaveBeenCalledWith(createProfileDto);

    expect(result).toStrictEqual(profileResult);
  });

  it('findAll => should return an array of profile', async () => {
    //arrange
    const profiles = [profileResult];
    jest.spyOn(mockRestService, 'findAll').mockResolvedValue(profiles);

    //act
    const result = await profileController.findAll();

    // assert
    expect(mockRestService.findAll).toHaveBeenCalled();

    expect(result).toEqual(profiles);
  });

  it('findOneById => should find a profile by a given id and return its data', async () => {
    //arrange
    const id = profileResult.profile_id;

    jest.spyOn(mockRestService, 'findOneById').mockResolvedValue(profileResult);

    //act
    const result = await profileController.findOneById(id);

    // assert
    expect(mockRestService.findOneById).toHaveBeenCalled();
    expect(mockRestService.findOneById).toHaveBeenCalledWith(id);

    expect(result).toEqual(profileResult);
  });

  it('update => Should update a new profile and return its data', async () => {
    // arrange
    const id = profileResult.profile_id;
    jest.spyOn(mockRestService, 'update').mockResolvedValue(profileResult);

    // act
    const result = await profileController.update(id, createProfileDto);

    // assert
    expect(mockRestService.update).toHaveBeenCalled();
    expect(mockRestService.update).toHaveBeenCalledWith(id, createProfileDto);

    expect(result).toStrictEqual(profileResult);
  });

  it('remove => should find a profile by a given id, remove and then return Number of affected rows', async () => {
    //arrange
    const id = profileResult.profile_id;

    jest
      .spyOn(mockRestService, 'remove')
      .mockResolvedValue(profileRemovedResult);

    //act
    const result = await profileController.remove(id);

    // assert
    expect(mockRestService.remove).toHaveBeenCalled();
    expect(mockRestService.remove).toHaveBeenCalledWith(id);

    expect(result).toEqual(profileRemovedResult);
  });

  // TODO: Need to work on controller and api for this implementation
  xit('findOneByEmail => should find a profile by a given email and return its data', () => {});
});
