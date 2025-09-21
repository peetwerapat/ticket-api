import { Job } from 'bullmq';

import { SlaHandler } from './sla.handler';

describe('SlaHandler', () => {
  let handler: SlaHandler;
  let mockLog: jest.SpyInstance;

  beforeEach(() => {
    handler = new SlaHandler();
    mockLog = jest.spyOn(handler['logger'], 'log').mockImplementation();
  });

  it('should log sla job', async () => {
    const job = { data: { ticketId: 456 } } as Job;
    await handler.handle(job);
    expect(mockLog).toHaveBeenCalledWith('sla:456');
  });
});
