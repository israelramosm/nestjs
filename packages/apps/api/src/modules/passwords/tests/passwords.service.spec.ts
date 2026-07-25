import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '@template/utils/tests/mocks/providers.mocks';
import * as bcrypt from 'bcrypt';
import { createPasswordDto, passwordResult } from 'src/utils/tests/mocks/data.mocks';
import { Password } from '../entities/password.entity';
import { PasswordsService } from '../passwords.service';
import { findPasswordByPasswordIdQuery } from '../queries/password.queries';

describe('PasswordsService', () => {
	let passwordsService: PasswordsService;
	let repository: ReturnType<typeof createMockRepository>;

	beforeEach(async () => {
		repository = createMockRepository();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PasswordsService,
				{ provide: getRepositoryToken(Password), useValue: repository },
			],
		}).compile();

		passwordsService = module.get(PasswordsService);
	});

	afterEach(() => {
		mock.restore();
	});

	it('should be defined', () => {
		expect(passwordsService).toBeDefined();
	});

	it('create => Should create a new password and return its data', async () => {
		repository.save.mockResolvedValue(passwordResult);
		spyOn(bcrypt, 'hash').mockResolvedValue(createPasswordDto.password as never);

		const result = await passwordsService.create(createPasswordDto);

		expect(repository.save).toHaveBeenCalledWith(
			expect.objectContaining({ password: createPasswordDto.password }),
		);
		expect(result).toStrictEqual(passwordResult);
	});

	it('findAll => should return an array of password', async () => {
		const passwords = [passwordResult];
		repository.find.mockResolvedValue(passwords);

		const result = await passwordsService.findAll();

		expect(repository.find).toHaveBeenCalled();
		expect(result).toEqual(passwords);
	});

	it('findOneById => should find a password by a given id and return its data', async () => {
		const id = passwordResult.password_id;
		repository.findOne.mockResolvedValue(passwordResult);

		const result = await passwordsService.findOneById(id);

		expect(repository.findOne).toHaveBeenCalledWith(findPasswordByPasswordIdQuery(id));
		expect(result).toEqual(passwordResult);
	});

	it('update => Should update a password and return its data', async () => {
		const passwordId = passwordResult.password_id;
		repository.save.mockResolvedValue(passwordResult);

		const result = await passwordsService.update(passwordId, createPasswordDto);

		expect(repository.save).toHaveBeenCalledWith(
			expect.objectContaining({ password_id: passwordId, password: createPasswordDto.password }),
		);
		expect(result).toStrictEqual(passwordResult);
	});

	it('remove => should remove a password by id and return the number of affected rows', async () => {
		const id = passwordResult.password_id;
		repository.findOne.mockResolvedValue(passwordResult);
		repository.delete.mockResolvedValue(passwordResult);

		const result = await passwordsService.remove(id);

		expect(repository.delete).toHaveBeenCalledWith(id);
		expect(result).toEqual(expect.objectContaining({ password_id: id }));
	});
});
