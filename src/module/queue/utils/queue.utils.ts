import { TQueueJobCounts } from '../type/queue.types';

export const mapCounts = (counts: Record<string, number>): TQueueJobCounts => ({
  waiting: counts.waiting ?? 0,
  active: counts.active ?? 0,
  completed: counts.completed ?? 0,
  failed: counts.failed ?? 0,
  delayed: counts.delayed ?? 0,
});
