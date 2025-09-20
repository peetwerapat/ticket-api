import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
export class NotifyHandler {
  private readonly logger = new Logger(NotifyHandler.name);

  async handle(job: Job) {
    this.logger.log(`notify:${job.data.ticketId}`);
  }
}
