import { TPagination } from 'src/common/types/pagination.type';

import { CreateTicketDto } from '../dto/create-ticket.dto';
import { FindAllQuery } from '../dto/find-all-query.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

import { Ticket } from '@prisma/client';

export interface ITicketService {
  create(data: CreateTicketDto): Promise<Ticket>;
  findAll(query: FindAllQuery): Promise<{ data: Ticket[]; pagination: TPagination }>;
  findById(id: number): Promise<Ticket>;
  update(id: number, data: UpdateTicketDto): Promise<Ticket>;
  delete(id: number): Promise<Ticket>;
}
