import { beforeEach, describe, expect, it } from 'bun:test';
import { Test, type TestingModule } from '@nestjs/testing';
import { createMockRestService } from '@template/utils/tests/mocks/providers.mocks';
import {
	createProfileDto,
	profileRemovedResult,
	profileResult,
} from 'src/utils/tests/mocks/data.mocks';
import { ProfileController } from '../profiles.controller';
import { ProfilesService } from '../profiles.service';

describe('ProfileController', () => {
	let profileController: ProfileController;
	let profilesService: ReturnType<typeof createMockRestService>;

	beforeEach(async () => {
		profilesService = createMockRestService();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProfileController],
			providers: [{ provide: ProfilesService, useValue: profilesService }],
		}).compile();

		profileController = module.get(ProfileController);
	});

	it('should be defined', () => {
		expect(profileController).toBeDefined();
	});

	it('create => Should create a new profile and return its data', async () => {
		profilesService.create.mockResolvedValue(profileResult);

		const result = await profileController.create(createProfileDto);

		expect(profilesService.create).toHaveBeenCalledWith(createProfileDto);
		expect(result).toStrictEqual(profileResult);
	});

	it('findAll => should return an array of profile', async () => {
		const profiles = [profileResult];
		profilesService.findAll.mockResolvedValue(profiles);

		const result = await profileController.findAll();

		expect(profilesService.findAll).toHaveBeenCalled();
		expect(result).toEqual(profiles);
	});

	it('findOneById => should find a profile by a given id and return its data', async () => {
		const id = profileResult.profile_id;
		profilesService.findOneById.mockResolvedValue(profileResult);

		const result = await profileController.findOneById(id);

		expect(profilesService.findOneById).toHaveBeenCalledWith(id);
		expect(result).toEqual(profileResult);
	});

	it('update => Should update a profile and return its data', async () => {
		const id = profileResult.profile_id;
		profilesService.update.mockResolvedValue(profileResult);

		const result = await profileController.update(id, createProfileDto);

		expect(profilesService.update).toHaveBeenCalledWith(id, createProfileDto);
		expect(result).toStrictEqual(profileResult);
	});

	it('remove => should remove a profile by id and return the number of affected rows', async () => {
		const id = profileResult.profile_id;
		profilesService.remove.mockResolvedValue(profileRemovedResult);

		const result = await profileController.remove(id);

		expect(profilesService.remove).toHaveBeenCalledWith(id);
		expect(result).toEqual(profileRemovedResult);
	});

	// TODO: Need to work on controller and api for this implementation
	it.skip('findOneByEmail => should find a profile by a given email and return its data', () => {});
});
