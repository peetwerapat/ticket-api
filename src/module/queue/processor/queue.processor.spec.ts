import { Worker } from 'bullmq';

import { EQueueName } from '../type/queue.enum';

import { QueueProcessor } from './queue.processor';

jest.mock('bullmq', () => ({
  Worker: jest.fn().mockImplementation((name, processor, opts) => ({
    name,
    processor,
    opts,
  })),
}));

describe('QueueProcessor', () => {
  let processor: QueueProcessor;
  const notifyHandler = { handle: jest.fn() };
  const slaHandler = { handle: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    processor = new QueueProcessor(notifyHandler as any, slaHandler as any);
  });

  it('should initialize workers on module init', async () => {
    await processor.onModuleInit();
    expect(Worker).toHaveBeenCalledWith(
      EQueueName.TICKET_NOTIFY,
      expect.any(Function),
      expect.objectContaining({ connection: expect.anything() }),
    );
    expect(Worker).toHaveBeenCalledWith(
      EQueueName.TICKET_SLA,
      expect.any(Function),
      expect.objectContaining({ connection: expect.anything() }),
    );
  });
});
