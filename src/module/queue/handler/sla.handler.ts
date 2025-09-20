import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
export class SlaHandler {
  private readonly logger = new Logger(SlaHandler.name);

  async handle(job: Job) {
    this.logger.log(`sla:${job.data.ticketId}`);
  }
}
