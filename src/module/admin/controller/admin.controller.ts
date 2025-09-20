import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpResponse } from 'src/common/types/http-response.type';
import type { IQueueService } from 'src/module/queue/service/queue.service.interface';
import { EQueueName } from 'src/module/queue/type/queue.enum';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('IQueueService')
    private _queueService: IQueueService,
  ) {}

  @Get('/queues/:name/stats')
  @ApiParam({
    name: 'name',
    enum: EQueueName,
  })
  async getQueueStats(@Param('name') name: EQueueName) {
    const stats = await this._queueService.getStats(name);

    return new HttpResponse({
      statusCode: HttpStatus.OK,
      message: 'Queue stats retrieved successfully.',
      data: stats,
    });
  }
}
