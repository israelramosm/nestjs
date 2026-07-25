import { beforeEach, describe, expect, it } from 'bun:test';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
	createMockRepository,
	createMockRestServiceData,
} from '@template/utils/tests/mocks/providers.mocks';
import { PasswordsService } from 'src/modules/passwords/passwords.service';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import {
	createUserDto,
	passwordResult,
	profileResult,
	userResult,
} from 'src/utils/tests/mocks/data.mocks';
import { User } from '../entities/user.entity';
import { findUserByEmailQuery, findUserByUserIdQuery } from '../queries/user.queries';
import { UsersService } from '../users.service';

describe('UsersService', () => {
	let userService: UsersService;
	let repository: ReturnType<typeof createMockRepository>;

	beforeEach(async () => {
		repository = createMockRepository();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: getRepositoryToken(User), useValue: repository },
				{ provide: ProfilesService, useValue: createMockRestServiceData(profileResult) },
				{ provide: PasswordsService, useValue: createMockRestServiceData(passwordResult) },
			],
		}).compile();

		userService = module.get(UsersService);
	});

	it('should be defined', () => {
		expect(userService).toBeDefined();
	});

	it('create => Should create a new user and return its data', async () => {
		repository.save.mockResolvedValue(userResult);

		const result = await userService.create(createUserDto);

		expect(repository.save).toHaveBeenCalledWith(
			expect.objectContaining({
				first_name: createUserDto.firstname,
				last_name: createUserDto.lastname,
				email: createUserDto.email,
				password: passwordResult,
				profile: profileResult,
			}),
		);
		expect(result).toStrictEqual(userResult);
	});

	it('findAll => should return an array of user', async () => {
		const users = [userResult];
		repository.find.mockResolvedValue(users);

		const result = await userService.findAll();

		expect(repository.find).toHaveBeenCalled();
		expect(result).toEqual(users);
	});

	it('findOneById => should find a user by a given id and return its data', async () => {
		const id = userResult.user_id;
		repository.findOne.mockResolvedValue(userResult);

		const result = await userService.findOneById(id);

		expect(repository.findOne).toHaveBeenCalledWith(findUserByUserIdQuery(id));
		expect(result).toEqual(userResult);
	});

	it('findOneByEmail => should find a user by a given email and return its data', async () => {
		const email = userResult.email;
		repository.findOne.mockResolvedValue(userResult);

		const result = await userService.findOneByEmail(email);

		expect(repository.findOne).toHaveBeenCalledWith(findUserByEmailQuery(email));
		expect(result).toEqual(userResult);
	});

	it('update => Should update a user and return its data', async () => {
		const id = userResult.user_id;
		repository.save.mockResolvedValue(userResult);

		const result = await userService.update(id, createUserDto);

		expect(repository.save).toHaveBeenCalledWith(
			expect.objectContaining({
				user_id: id,
				first_name: createUserDto.firstname,
				last_name: createUserDto.lastname,
				email: createUserDto.email,
			}),
		);
		expect(result).toStrictEqual(userResult);
	});

	it('remove => should remove a user by id and return the number of affected rows', async () => {
		const id = userResult.user_id;
		repository.findOne.mockResolvedValue(userResult);
		repository.delete.mockResolvedValue(userResult);

		const result = await userService.remove(id);

		expect(repository.delete).toHaveBeenCalledWith(userResult.user_id);
		expect(result).toEqual(
			expect.objectContaining({
				user_id: userResult.user_id,
				email: userResult.email,
				first_name: userResult.first_name,
				last_name: userResult.last_name,
				profile: profileResult,
				password: passwordResult,
			}),
		);
	});

	describe('Error', () => {
		it('create => Should throw a HttpException if the user email already exists', async () => {
			repository.findOne.mockResolvedValue(userResult);

			const result = userService.create(createUserDto);

			await expect(result).rejects.toEqual(
				new HttpException('User email already exist', HttpStatus.CONFLICT),
			);
			expect(repository.findOne).toHaveBeenCalledWith(findUserByEmailQuery(createUserDto.email));
		});
	});
});
