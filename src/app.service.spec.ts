import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HealthCheck } from './utils/types';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should return Healt check object', () => {
    // arrange
    const healthCheck: HealthCheck = {
      ok: true,
      message: 'App is running ...',
    };

    const result = appService.getHealthCheck();

    expect(result).toEqual(healthCheck);
  });
});
