import { Injectable, Logger } from '@nestjs/common';
import type { HealthCheck } from '@template/utils/types';

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	getHealthCheck(): HealthCheck {
		this.logger.log('health check');
		return { ok: true, message: 'App is running ...' };
	}
}
