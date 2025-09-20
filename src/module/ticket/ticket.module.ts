import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';

import { TicketController } from './controller/ticket.controller';
import { TicketRepositoryImpl } from './repository/ticket.repository.impl';
import { TicketServiceImpl } from './service/ticket.service.impl';

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [TicketController],
  providers: [
    { provide: 'ITicketRepository', useClass: TicketRepositoryImpl },
    { provide: 'ITicketService', useClass: TicketServiceImpl },
  ],
})
export class TicketModule {}
