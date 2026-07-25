import { beforeEach, describe, expect, it } from 'bun:test';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '@template/utils/tests/mocks/providers.mocks';
import { ProfilesService } from '#src/modules/profiles/profiles.service';
import { createProfileDto, profileResult } from '#src/utils/tests/mocks/data.mocks';
import { Profile } from '../entities/profile.entity';
import {
	findProfileByProfileIdQuery,
	findProfileByUsernameQuery,
} from '../queries/profile.queries';

describe('ProfileService', () => {
	let profileService: ProfilesService;
	let repository: ReturnType<typeof createMockRepository>;

	beforeEach(async () => {
		repository = createMockRepository();

		const module: TestingModule = await Test.createTestingModule({
			providers: [ProfilesService, { provide: getRepositoryToken(Profile), useValue: repository }],
		}).compile();

		profileService = module.get(ProfilesService);
	});

	it('should be defined', () => {
		expect(profileService).toBeDefined();
	});

	it('create => Should create a new profile and return its data', async () => {
		repository.save.mockResolvedValue(profileResult);

		const result = await profileService.create(createProfileDto);

		expect(repository.save).toHaveBeenCalledWith(createProfileDto);
		expect(result).toStrictEqual(profileResult);
	});

	it('findAll => should return an array of profile', async () => {
		const profiles = [profileResult];
		repository.find.mockResolvedValue(profiles);

		const result = await profileService.findAll();

		expect(repository.find).toHaveBeenCalled();
		expect(result).toEqual(profiles);
	});

	it('findOneById => should find a profile by a given id and return its data', async () => {
		const id = profileResult.profile_id;
		repository.findOne.mockResolvedValue(profileResult);

		const result = await profileService.findOneById(id);

		expect(repository.findOne).toHaveBeenCalledWith(findProfileByProfileIdQuery(id));
		expect(result).toEqual(profileResult);
	});

	it('findOneByUsername => should find a profile by a given username and return its data', async () => {
		const username = profileResult.username;
		repository.findOne.mockResolvedValue(profileResult);

		const result = await profileService.findOneByUsername(username);

		expect(repository.findOne).toHaveBeenCalledWith(findProfileByUsernameQuery(username));
		expect(result).toEqual(profileResult);
	});

	it('update => Should update a profile and return its data', async () => {
		const id = profileResult.profile_id;
		repository.save.mockResolvedValue(profileResult);

		const result = await profileService.update(id, createProfileDto);

		expect(repository.save).toHaveBeenCalledWith(
			expect.objectContaining({ profile_id: id, username: createProfileDto.username }),
		);
		expect(result).toStrictEqual(profileResult);
	});

	it('remove => should remove a profile by id and return the number of affected rows', async () => {
		const id = profileResult.profile_id;
		repository.findOne.mockResolvedValue(profileResult);
		repository.delete.mockResolvedValue(profileResult);

		const result = await profileService.remove(id);

		expect(repository.delete).toHaveBeenCalledWith(id);
		expect(result).toEqual(
			expect.objectContaining({ profile_id: id, username: profileResult.username }),
		);
	});

	describe('Error', () => {
		it('create => Should throw a HttpException if the username already exists', async () => {
			repository.findOne.mockResolvedValue(profileResult);

			const result = profileService.create(createProfileDto);

			await expect(result).rejects.toEqual(
				new HttpException('Username already exist', HttpStatus.CONFLICT),
			);
			expect(repository.findOne).toHaveBeenCalledWith(
				findProfileByUsernameQuery(createProfileDto.username),
			);
		});
	});
});
