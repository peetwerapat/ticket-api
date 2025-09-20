import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisConnection } from 'src/common/redis/redisConnection';
import { TQueueJobCounts } from 'src/module/queue/type/queue.types';

import { EQueueName } from '../type/queue.enum';
import { mapCounts } from '../utils/queue.utils';

import { IQueueService } from './queue.service.interface';

@Injectable()
export class QueueServiceImpl implements IQueueService {
  private _notifyQueue = new Queue(EQueueName.TICKET_NOTIFY, { connection: redisConnection });
  private _slaQueue = new Queue(EQueueName.TICKET_SLA, { connection: redisConnection });

  async addNotify(ticketId: number) {
    await this._notifyQueue.add(
      'notify',
      { ticketId },
      { jobId: `notify:${ticketId}`, attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    );
  }

  async addSla(ticketId: number) {
    await this._slaQueue.add(
      'sla',
      { ticketId },
      { jobId: `sla:${ticketId}`, delay: 15 * 60 * 1000 },
    );
  }

  async removeSla(ticketId: number): Promise<boolean> {
    const jobId = `sla:${ticketId}`;
    const job = await this._slaQueue.getJob(jobId);

    if (!job) return false;

    const state = await job.getState();
    if (state === 'active') {
      throw new UnprocessableEntityException(`Cannot remove SLA job ${jobId} because it is active`);
    }

    await job.remove();
    return true;
  }

  async getStats(queueName: EQueueName): Promise<TQueueJobCounts> {
    const queue = queueName === EQueueName.TICKET_NOTIFY ? this._notifyQueue : this._slaQueue;
    const counts = await queue.getJobCounts();
    return mapCounts(counts);
  }
}
