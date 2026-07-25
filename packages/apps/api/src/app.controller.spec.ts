import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { Test, type TestingModule } from '@nestjs/testing';
import type { HealthCheck } from '@template/utils/types';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;
	let appService: { getHealthCheck: ReturnType<typeof mock> };

	beforeEach(async () => {
		appService = { getHealthCheck: mock() };

		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [{ provide: AppService, useValue: appService }],
		}).compile();

		appController = moduleRef.get(AppController);
	});

	describe('health check', () => {
		it('should be defined', () => {
			expect(appController).toBeDefined();
		});

		it('should return health check object', () => {
			const healthCheck: HealthCheck = {
				ok: true,
				message: 'App is running ...',
			};
			appService.getHealthCheck.mockReturnValue(healthCheck);

			const result = appController.getHealthCheck();

			expect(appService.getHealthCheck).toHaveBeenCalled();
			expect(result).toEqual(healthCheck);
			expect(result.ok).toBeTruthy();
			expect(result.message).toEqual('App is running ...');
		});
	});
});
