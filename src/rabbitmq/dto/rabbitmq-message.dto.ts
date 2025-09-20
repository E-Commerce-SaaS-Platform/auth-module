import { IsString, IsOptional, IsObject, IsDateString } from 'class-validator';

export class RabbitMQMessageDto<T = any> {
  @IsString()
  event: string;

  @IsString()
  @IsOptional()
  correlationId?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @IsObject()
  @IsOptional()
  data?: T;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
