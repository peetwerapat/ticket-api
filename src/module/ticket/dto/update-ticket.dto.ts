import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { Priority, Status } from '@prisma/client';

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'Title of the ticket (min 5 characters)',
    minLength: 5,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the ticket (max 5000 characters)',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description must be at most 5000 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: `Priority of the ticket`,
    enum: Priority,
  })
  @IsOptional()
  @IsEnum(Priority, {
    message: `Priority must be one of: ${Object.values(Priority).join(', ')}`,
  })
  priority?: Priority;

  @ApiPropertyOptional({
    description: `Status of the ticket`,
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status, {
    message: `Status must be one of: ${Object.values(Status).join(', ')}`,
  })
  status?: Status;
}
