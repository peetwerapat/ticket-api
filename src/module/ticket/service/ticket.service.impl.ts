import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TPagination } from 'src/common/types/pagination.type';
import { generatePagination, getPaginationValue } from 'src/common/utils/pagination';
import type { IQueueService } from 'src/module/queue/service/queue.service.interface';

import { CreateTicketDto } from '../dto/create-ticket.dto';
import { FindAllQuery } from '../dto/find-all-query.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import type { ITicketRepository } from '../repository/ticket.repository.interface';
import { ETicketStatus } from '../type/ticket.enum';

import { ITicketService } from './ticket.service.interface';

import { Ticket } from '@prisma/client';

@Injectable()
export class TicketServiceImpl implements ITicketService {
  constructor(
    @Inject('ITicketRepository')
    private _ticketRepo: ITicketRepository,
    @Inject('IQueueService')
    private _queueService: IQueueService,
  ) {}

  async create(data: CreateTicketDto): Promise<Ticket> {
    try {
      const ticket = await this._ticketRepo.create(data);

      await this._queueService.addNotify(ticket.id);
      await this._queueService.addSla(ticket.id);

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: FindAllQuery): Promise<{ data: Ticket[]; pagination: TPagination }> {
    const { skip, take } = getPaginationValue({
      page: query.page,
      pageSize: query.pageSize,
    });

    const { items, totalCounts } = await this._ticketRepo.findAll({
      ...query,
      skip,
      take,
    });

    return {
      data: items,
      pagination: generatePagination({ totalCounts, take, skip }),
    };
  }

  async findById(id: number): Promise<Ticket> {
    const ticket = await this._ticketRepo.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with id:${id} not found`);
    }

    return ticket;
  }

  async update(id: number, data: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this._ticketRepo.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with id:${id} not found`);
    }

    const updatedTicket = await this._ticketRepo.update(id, data);

    if (data.status === ETicketStatus.RESOLVED) {
      await this._queueService.removeSla(id);
    }

    return updatedTicket;
  }

  async delete(id: number): Promise<Ticket> {
    const ticket = await this._ticketRepo.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with id:${id} not found`);
    }

    const deletedTicket = await this._ticketRepo.delete(id);

    return deletedTicket;
  }
}
