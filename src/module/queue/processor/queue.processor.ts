import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { redisConnection } from 'src/common/redis/redisConnection';

import { NotifyHandler } from '../handler/notify.handler';
import { SlaHandler } from '../handler/sla.handler';
import { EQueueName } from '../type/queue.enum';

@Injectable()
export class QueueProcessor implements OnModuleInit {
  constructor(
    private readonly _notifyHandler: NotifyHandler,
    private readonly _slaHandler: SlaHandler,
  ) {}

  async onModuleInit() {
    new Worker(EQueueName.TICKET_NOTIFY, (job) => this._notifyHandler.handle(job), {
      connection: redisConnection,
    });
    new Worker(EQueueName.TICKET_SLA, (job) => this._slaHandler.handle(job), {
      connection: redisConnection,
    });
  }
}
