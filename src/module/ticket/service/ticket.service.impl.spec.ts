import { NotFoundException } from '@nestjs/common';

import { ETicketPriority, ETicketStatus } from '../type/ticket.enum';

import { TicketServiceImpl } from './ticket.service.impl';

import { Ticket } from '@prisma/client';

describe('TicketServiceImpl', () => {
  let service: TicketServiceImpl;
  let mockRepo: any;
  let mockQueue: any;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockQueue = {
      addNotify: jest.fn(),
      addSla: jest.fn(),
      removeSla: jest.fn(),
    };

    service = new TicketServiceImpl(mockRepo, mockQueue);
  });

  it('should create ticket and enqueue jobs', async () => {
    const ticket = { id: 1, title: 't' } as Ticket;
    mockRepo.create.mockResolvedValue(ticket);

    const result = await service.create({
      title: 't',
      description: 'd',
      priority: ETicketPriority.LOW,
    } as any);

    expect(result).toEqual(ticket);
    expect(mockQueue.addNotify).toHaveBeenCalledWith(1);
    expect(mockQueue.addSla).toHaveBeenCalledWith(1);
  });

  it('should return paginated tickets', async () => {
    mockRepo.findAll.mockResolvedValue({ items: [{ id: 1 }], totalCounts: 1 });

    const result = await service.findAll({ page: 1, pageSize: 10 } as any);

    expect(result.data).toEqual([{ id: 1 }]);
    expect(result.pagination.totalCounts).toBe(1);
  });

  it('should find ticket by id', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });

    const ticket = await service.findById(1);
    expect(ticket).toEqual({ id: 1 });
  });

  it('should throw NotFound if ticket not found by id', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('should update ticket and remove SLA if resolved', async () => {
    const existing = { id: 1 } as Ticket;
    const updated = { id: 1, status: ETicketStatus.RESOLVED } as Ticket;
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updated);

    const result = await service.update(1, { status: ETicketStatus.RESOLVED } as any);

    expect(result).toEqual(updated);
    expect(mockQueue.removeSla).toHaveBeenCalledWith(1);
  });

  it('should throw NotFound on update if not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.update(99, { status: ETicketStatus.OPEN } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete ticket', async () => {
    const ticket = { id: 1 } as Ticket;
    mockRepo.findById.mockResolvedValue(ticket);
    mockRepo.delete.mockResolvedValue(ticket);

    const result = await service.delete(1);

    expect(result).toEqual(ticket);
  });

  it('should throw NotFound on delete if not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.delete(99)).rejects.toThrow(NotFoundException);
  });
});
