import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/service/prisma.service';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { FindAllQuery } from '../dto/find-all-query.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

import { ITicketRepository } from './ticket.repository.interface';

import { Prisma, Ticket } from '@prisma/client';

@Injectable()
export class TicketRepositoryImpl implements ITicketRepository {
  constructor(private _prisma: PrismaService) {}

  async create(data: CreateTicketDto): Promise<Ticket> {
    return await this._prisma.ticket.create({ data });
  }

  async findAll(query: FindAllQuery & { skip: number; take: number }): Promise<{
    items: Ticket[];
    totalCounts: number;
  }> {
    const { search, status, priority, skip, take, sort, order } = query;

    const where: Prisma.TicketWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const [items, totalCounts] = await this._prisma.$transaction([
      this._prisma.ticket.findMany({
        where,
        skip,
        take,
        orderBy: sort
          ? { [sort]: order?.toLowerCase() === 'desc' ? 'desc' : 'asc' }
          : { createdAt: 'desc' },
      }),
      this._prisma.ticket.count({ where }),
    ]);

    return { items, totalCounts };
  }

  async findById(id: number): Promise<Ticket | null> {
    const ticket = await this._prisma.ticket.findUnique({
      where: { id },
    });

    return ticket;
  }

  async update(id: number, data: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this._prisma.ticket.update({
      where: { id },
      data,
    });
    return ticket;
  }

  async delete(id: number): Promise<Ticket> {
    const ticket = this._prisma.ticket.delete({
      where: { id },
    });

    return ticket;
  }
}
