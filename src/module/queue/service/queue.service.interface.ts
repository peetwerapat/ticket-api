import { EQueueName } from '../type/queue.enum';
import { TQueueJobCounts } from '../type/queue.types';

export interface IQueueService {
  addNotify(ticketId: number): Promise<void>;
  addSla(ticketId: number): Promise<void>;
  removeSla(ticketId: number): Promise<boolean>;
  getStats(queueName: EQueueName): Promise<TQueueJobCounts>;
}
