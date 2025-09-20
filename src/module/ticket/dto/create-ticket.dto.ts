import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { ETicketPriority } from '../type/ticket.enum';

import { Priority } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ description: 'Title of the ticket', minLength: 5 })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  title: string;

  @ApiProperty({ description: 'Description of the ticket', maxLength: 5000 })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description must be at most 5000 characters' })
  description: string;

  @ApiProperty({ enum: Priority, description: 'Priority of the ticket' })
  @IsNotEmpty({ message: 'Priority is required' })
  @IsEnum(ETicketPriority, {
    message: `Priority must be one of: ${Object.values(ETicketPriority).join(', ')}`,
  })
  priority: Priority;
}
