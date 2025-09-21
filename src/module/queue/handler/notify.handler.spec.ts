import { Job } from 'bullmq';

import { NotifyHandler } from './notify.handler';

describe('NotifyHandler', () => {
  let handler: NotifyHandler;
  let mockLog: jest.SpyInstance;

  beforeEach(() => {
    handler = new NotifyHandler();
    mockLog = jest.spyOn(handler['logger'], 'log').mockImplementation();
  });

  it('should log notify job', async () => {
    const job = { data: { ticketId: 123 } } as Job;
    await handler.handle(job);
    expect(mockLog).toHaveBeenCalledWith('notify:123');
  });
});
