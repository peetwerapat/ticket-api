import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ESortOrder } from 'src/common/types/global.enum';
import { HttpResponse } from 'src/common/types/http-response.type';

import { CreateTicketDto } from '../dto/create-ticket.dto';
import { FindAllQuery } from '../dto/find-all-query.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import type { ITicketService } from '../service/ticket.service.interface';
import { ETicketPriority, ETicketStatus } from '../type/ticket.enum';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(
    @Inject('ITicketService')
    private _ticketService: ITicketService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() dto: CreateTicketDto) {
    const ticket = await this._ticketService.create(dto);

    return new HttpResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Ticket created successfully.',
      data: ticket,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets with optional filters' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ETicketStatus,
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ETicketPriority,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ESortOrder,
  })
  @ApiResponse({
    status: 200,
    description: 'List of tickets returned successfully',
  })
  async findAll(@Query() query: FindAllQuery) {
    const service = await this._ticketService.findAll(query);

    if (service.data.length === 0) {
      return new HttpResponse({
        statusCode: HttpStatus.OK,
        message: 'No tickets found',
        data: service.data,
        pagination: service.pagination,
      });
    }

    return new HttpResponse({
      statusCode: HttpStatus.OK,
      message: 'Tickets retrieved successfully.',
      data: service.data,
      pagination: service.pagination,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Ticket ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Ticket retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    const ticket = await this._ticketService.findById(id);

    return new HttpResponse({
      statusCode: HttpStatus.OK,
      message: 'Ticket retrieved successfully.',
      data: ticket,
    });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID', example: 1 })
  @ApiOkResponse({ description: 'Ticket updated successfully' })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTicketDto) {
    const updatedTicket = await this._ticketService.update(id, dto);

    return new HttpResponse({
      statusCode: HttpStatus.OK,
      message: 'Ticket updated successfully',
      data: updatedTicket,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Ticket ID', example: 1 })
  @ApiOkResponse({ description: 'Ticket deleted successfully' })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deletedTicket = await this._ticketService.delete(id);

    return new HttpResponse({
      statusCode: HttpStatus.OK,
      message: 'Ticket deleted successfully',
      data: deletedTicket,
    });
  }
}
