import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheck } from './utils/types';
import { Public } from './common/decorators/public';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHealthCheck(): HealthCheck {
    return this.appService.getHealthCheck();
  }
}
