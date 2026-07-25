import { beforeEach, describe, expect, it } from 'bun:test';
import { Test, type TestingModule } from '@nestjs/testing';
import { createMockUserRestService } from '@template/utils/tests/mocks/providers.mocks';
import { createUserDto, userRemovedResult, userResult } from 'src/utils/tests/mocks/data.mocks';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
	let userController: UsersController;
	let usersService: ReturnType<typeof createMockUserRestService>;

	beforeEach(async () => {
		usersService = createMockUserRestService();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [{ provide: UsersService, useValue: usersService }],
		}).compile();

		userController = module.get(UsersController);
	});

	it('should be defined', () => {
		expect(userController).toBeDefined();
	});

	it('create => Should create a new user and return its data', async () => {
		usersService.create.mockResolvedValue(userResult);

		const result = await userController.create(createUserDto);

		expect(usersService.create).toHaveBeenCalledWith(createUserDto);
		expect(result).toStrictEqual(userResult);
	});

	it('findAll => should return an array of user', async () => {
		const users = [userResult];
		usersService.findAll.mockResolvedValue(users);

		const result = await userController.findAll();

		expect(usersService.findAll).toHaveBeenCalled();
		expect(result).toEqual(users);
	});

	it('findOneById => should find a user by a given id and return its data', async () => {
		const id = userResult.user_id;
		usersService.findOneById.mockResolvedValue(userResult);

		const result = await userController.findOneById(id);

		expect(usersService.findOneById).toHaveBeenCalledWith(id);
		expect(result).toEqual(userResult);
	});

	it('update => Should update a user and return its data', async () => {
		const id = userResult.user_id;
		usersService.update.mockResolvedValue(userResult);

		const result = await userController.update(id, createUserDto);

		expect(usersService.update).toHaveBeenCalledWith(id, createUserDto);
		expect(result).toStrictEqual(userResult);
	});

	it('remove => should remove a user by id and return the number of affected rows', async () => {
		const id = userResult.user_id;
		usersService.remove.mockResolvedValue(userRemovedResult);

		const result = await userController.remove(id);

		expect(usersService.remove).toHaveBeenCalledWith(id);
		expect(result).toEqual(userRemovedResult);
	});

	// TODO: Need to work on controller and api for this implementation
	it.skip('findOneByEmail => should find a user by a given email and return its data', () => {});
});
