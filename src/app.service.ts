import { Injectable, Logger } from '@nestjs/common';
import { HealthCheck } from './utils/types';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHealthCheck(): HealthCheck {
    this.logger.log('health check');
    return { ok: true, message: 'App is running ...' };
  }
}
