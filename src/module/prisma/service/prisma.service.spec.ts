import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    service = new PrismaService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call $connect on init', async () => {
    const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined);
    await service.onModuleInit();
    expect(connectSpy).toHaveBeenCalled();
  });
});
