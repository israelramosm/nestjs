import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheck } from './utils/types';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHealthCheck: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should return health check object', () => {
      // arrange
      const healthCheck: HealthCheck = {
        ok: true,
        message: 'App is running ...',
      };
      jest
        .spyOn(mockAppService, 'getHealthCheck')
        .mockImplementation(() => healthCheck);

      // act
      const result = appController.getHealthCheck();

      // assert
      expect(mockAppService.getHealthCheck).toHaveBeenCalled();

      expect(result).toEqual(healthCheck);
      expect(result.ok).toBeTruthy();
      expect(result.message).toEqual('App is running ...');
    });
  });
});
