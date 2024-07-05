import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHealthCheck(): any {
    this.logger.log('health check');
    return { ok: true, message: 'App is running ...' };
  }
}
