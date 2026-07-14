import { Controller, Get } from '@nestjs/common';
import type { HealthCheck } from '@template/utils/types';
import { AppService } from './app.service';
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
