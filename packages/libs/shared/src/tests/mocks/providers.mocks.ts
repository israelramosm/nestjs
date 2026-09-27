import { mock } from 'bun:test';

/**
 * Cada helper devuelve mocks nuevos por invocacion para que cada test tenga su
 * propio estado aislado. Asi `bun test` puede correr todos los archivos en un
 * unico proceso sin que las llamadas se filtren entre suites.
 */

export const createMockRepository = () => ({
	save: mock(),
	find: mock(),
	findOne: mock(),
	update: mock(),
	delete: mock(),
});

export const createMockRestService = () => ({
	create: mock(),
	findAll: mock(),
	findOneById: mock(),
	update: mock(),
	remove: mock(),
});

export const createMockAuthService = () => ({
	validateUser: mock(),
	login: mock(),
});

export const createMockRestServiceData = (resolvedValue: unknown) => ({
	create: mock().mockResolvedValue(resolvedValue),
	findAll: mock().mockResolvedValue([resolvedValue]),
	findOneById: mock().mockResolvedValue(resolvedValue),
	update: mock().mockResolvedValue(resolvedValue),
	remove: mock().mockResolvedValue(resolvedValue),
});

export const createMockUserRestService = () => ({
	...createMockRestService(),
	findOneByEmail: mock(),
});

export const createMockJWTService = () => ({
	sign: mock(),
});
