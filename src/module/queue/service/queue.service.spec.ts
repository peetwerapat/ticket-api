import { UnprocessableEntityException } from '@nestjs/common';

import { EQueueName } from '../type/queue.enum';

import { QueueServiceImpl } from './queue.service.impl';

jest.mock('bullmq', () => {
  const jobs: Record<string, any> = {};
  return {
    Queue: jest.fn().mockImplementation((name: string) => ({
      name,
      add: jest.fn((jobName, data, opts) => {
        jobs[opts.jobId] = {
          ...opts,
          data,
          name: jobName,
          state: 'waiting',
          remove: jest.fn(),
          getState: jest.fn().mockResolvedValue('waiting'), // 👈 เพิ่มตรงนี้
        };
        return Promise.resolve(jobs[opts.jobId]);
      }),
      getJob: jest.fn((id: string) => Promise.resolve(jobs[id] ?? null)),
      getJobCounts: jest.fn(() =>
        Promise.resolve({ waiting: 1, active: 2, completed: 3, failed: 0, delayed: 0 }),
      ),
    })),
  };
});

describe('QueueServiceImpl', () => {
  let service: QueueServiceImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new QueueServiceImpl();
  });

  it('should add notify job', async () => {
    await service.addNotify(1);
    expect((service as any)._notifyQueue.add).toHaveBeenCalledWith(
      'notify',
      { ticketId: 1 },
      expect.objectContaining({ jobId: 'notify:1' }),
    );
  });

  it('should add sla job', async () => {
    await service.addSla(2);
    expect((service as any)._slaQueue.add).toHaveBeenCalledWith(
      'sla',
      { ticketId: 2 },
      expect.objectContaining({ jobId: 'sla:2' }),
    );
  });

  it('should remove sla job if not active', async () => {
    await service.addSla(3);
    const result = await service.removeSla(3);
    expect(result).toBe(true);
  });

  it('should throw if sla job is active', async () => {
    await service.addSla(4);
    const job = await (service as any)._slaQueue.getJob('sla:4');
    job.state = 'active';
    job.getState = jest.fn().mockResolvedValue('active');

    await expect(service.removeSla(4)).rejects.toThrow(UnprocessableEntityException);
  });

  it('should return stats', async () => {
    const stats = await service.getStats(EQueueName.TICKET_NOTIFY);
    expect(stats).toEqual({
      waiting: 1,
      active: 2,
      completed: 3,
      failed: 0,
      delayed: 0,
    });
  });
});
