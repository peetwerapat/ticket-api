import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from './module/admin/admin.module';
import { TicketModule } from './module/ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TicketModule,
    AdminModule,
  ],
})
export class AppModule {}
