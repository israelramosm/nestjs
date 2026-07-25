import { beforeEach, describe, expect, it } from 'bun:test';
import { Test, type TestingModule } from '@nestjs/testing';
import type { HealthCheck } from '@template/utils/types';
import { AppService } from './app.service';

describe('AppService', () => {
	let appService: AppService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AppService],
		}).compile();

		appService = module.get(AppService);
	});

	it('should be defined', () => {
		expect(appService).toBeDefined();
	});

	it('should return health check object', () => {
		const healthCheck: HealthCheck = {
			ok: true,
			message: 'App is running ...',
		};

		expect(appService.getHealthCheck()).toEqual(healthCheck);
	});
});
