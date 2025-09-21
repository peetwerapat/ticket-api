import { PrismaService } from '../../prisma/service/prisma.service';
import { ETicketPriority } from '../type/ticket.enum';

import { TicketRepositoryImpl } from './ticket.repository.impl';

describe('TicketRepositoryImpl', () => {
  let repo: TicketRepositoryImpl;
  let mockPrisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      ticket: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    } as any;

    repo = new TicketRepositoryImpl(mockPrisma);
  });

  it('should create ticket', async () => {
    const fake = { id: 1 };
    (mockPrisma.ticket.create as jest.Mock).mockResolvedValue(fake as any);

    const result = await repo.create({
      title: 't',
      description: 'd',
      priority: ETicketPriority.LOW,
    } as any);

    expect(result).toEqual(fake);
  });

  it('should find all tickets with pagination', async () => {
    mockPrisma.$transaction.mockResolvedValue([[{ id: 1 }], 1]);

    const result = await repo.findAll({ skip: 0, take: 10 } as any);

    expect(result.items).toEqual([{ id: 1 }]);
    expect(result.totalCounts).toBe(1);
  });

  it('should find by id', async () => {
    (mockPrisma.ticket.findUnique as jest.Mock).mockResolvedValue({ id: 1 } as any);

    const result = await repo.findById(1);

    expect(result).toEqual({ id: 1 });
  });

  it('should update ticket', async () => {
    (mockPrisma.ticket.update as jest.Mock).mockResolvedValue({ id: 1, title: 'u' } as any);

    const result = await repo.update(1, { title: 'u' } as any);

    expect(result.title).toBe('u');
  });

  it('should delete ticket', async () => {
    (mockPrisma.ticket.delete as jest.Mock).mockResolvedValue({ id: 1 } as any);

    const result = await repo.delete(1);

    expect(result.id).toBe(1);
  });
});
