import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpResponse } from 'src/common/types/http-response.type';

import { ITicketService } from '../service/ticket.service.interface';
import { ETicketPriority, ETicketStatus } from '../type/ticket.enum';

import { TicketController } from './ticket.controller';

describe('TicketController', () => {
  let controller: TicketController;
  let mockService: jest.Mocked<ITicketService>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [{ provide: 'ITicketService', useValue: mockService }],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should create ticket', async () => {
    const fakeTicket = { id: 1, title: 't' };
    mockService.create.mockResolvedValue(fakeTicket as any);

    const result = await controller.create({
      title: 't',
      description: 'd',
      priority: ETicketPriority.LOW,
    } as any);

    expect(result).toEqual(
      new HttpResponse({
        statusCode: HttpStatus.CREATED,
        message: 'Ticket created successfully.',
        data: fakeTicket,
      }),
    );
  });

  it('should return tickets with data', async () => {
    const serviceResponse = {
      data: [
        {
          id: 1,
          title: 'Test Ticket',
          description: 'Test Description',
          priority: ETicketPriority.LOW,
          status: ETicketStatus.OPEN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: { totalCounts: 1, page: 1, pageSize: 1, totalPages: 1 },
    };
    mockService.findAll.mockResolvedValue({
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
    });

    const result = await controller.findAll({} as any);

    expect(result).toEqual(
      new HttpResponse({
        statusCode: HttpStatus.OK,
        message: 'Tickets retrieved successfully.',
        data: serviceResponse.data,
        pagination: serviceResponse.pagination,
      }),
    );
  });

  it('should return no tickets found if empty', async () => {
    const serviceResponse = {
      data: [],
      pagination: { totalCounts: 0, page: 0, pageSize: 0, totalPages: 0 },
    };
    mockService.findAll.mockResolvedValue(serviceResponse);

    const result = await controller.findAll({} as any);

    expect(result.message).toBe('No tickets found');
    expect(result.data).toEqual([]);
  });

  it('should get ticket by id', async () => {
    const fakeTicket = { id: 1 };
    mockService.findById.mockResolvedValue(fakeTicket as any);

    const result = await controller.getById(1);

    expect(result.data).toEqual(fakeTicket);
  });

  it('should update ticket', async () => {
    const updated = { id: 1, title: 'new' };
    mockService.update.mockResolvedValue(updated as any);

    const result = await controller.update(1, { title: 'new' } as any);

    expect(result.data).toEqual(updated);
  });

  it('should delete ticket', async () => {
    const deleted = { id: 1 };
    mockService.delete.mockResolvedValue(deleted as any);

    const result = await controller.delete(1);

    expect(result.data).toEqual(deleted);
  });
});
