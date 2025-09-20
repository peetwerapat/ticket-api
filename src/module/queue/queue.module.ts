import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { redisConnection } from 'src/common/redis/redisConnection';

import { NotifyHandler } from './handler/notify.handler';
import { SlaHandler } from './handler/sla.handler';
import { QueueProcessor } from './processor/queue.processor';
import { QueueServiceImpl } from './service/queue.service.impl';

@Module({
  imports: [
    BullModule.forRoot({
      connection: redisConnection,
    }),
  ],
  providers: [
    {
      provide: 'IQueueService',
      useClass: QueueServiceImpl,
    },
    NotifyHandler,
    SlaHandler,
    QueueProcessor,
  ],
  exports: ['IQueueService'],
})
export class QueueModule {}
