import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpResponse } from 'src/common/types/http-response.type';
import { IQueueService } from 'src/module/queue/service/queue.service.interface';
import { EQueueName } from 'src/module/queue/type/queue.enum';

import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;
  let mockQueueService: jest.Mocked<IQueueService>;

  beforeEach(async () => {
    mockQueueService = {
      getStats: jest.fn(),
      addNotify: jest.fn(),
      addSla: jest.fn(),
      removeSla: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: 'IQueueService', useValue: mockQueueService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should return queue stats', async () => {
    const fakeStats = { waiting: 1, active: 0, completed: 2, failed: 0, delayed: 0, paused: 0 };
    mockQueueService.getStats.mockResolvedValue(fakeStats);

    const result = await controller.getQueueStats(EQueueName.TICKET_NOTIFY);

    expect(result).toEqual(
      new HttpResponse({
        statusCode: HttpStatus.OK,
        message: 'Queue stats retrieved successfully.',
        data: fakeStats,
      }),
    );
    expect(mockQueueService.getStats).toHaveBeenCalledWith(EQueueName.TICKET_NOTIFY);
  });
});
