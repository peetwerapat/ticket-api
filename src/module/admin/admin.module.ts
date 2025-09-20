import { Module } from '@nestjs/common';

import { QueueModule } from '../queue/queue.module';

import { AdminController } from './controller/admin.controller';

@Module({
  imports: [QueueModule],
  controllers: [AdminController],
})
export class AdminModule {}
