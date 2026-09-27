import { Controller, Get } from '@nestjs/common';
import { Public } from '@template/modules-identity/common/decorators/public';
import type { HealthCheck } from '@template/utils/types';
import { AppService } from '#src/app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Public()
	getHealthCheck(): HealthCheck {
		return this.appService.getHealthCheck();
	}
}
