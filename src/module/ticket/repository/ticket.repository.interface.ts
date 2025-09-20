import { CreateTicketDto } from '../dto/create-ticket.dto';
import { FindAllQuery } from '../dto/find-all-query.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

import { Ticket } from '@prisma/client';

export interface ITicketRepository {
  create(data: CreateTicketDto): Promise<Ticket>;
  findAll(query: FindAllQuery & { skip: number; take: number }): Promise<{
    items: Ticket[];
    totalCounts: number;
  }>;
  findById(id: number): Promise<Ticket | null>;
  update(id: number, data: UpdateTicketDto): Promise<Ticket>;
  delete(id: number): Promise<Ticket>;
}
