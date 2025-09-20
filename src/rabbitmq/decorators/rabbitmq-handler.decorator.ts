import { SetMetadata } from '@nestjs/common';
import { RabbitMQHandlerOptions } from '../interfaces/rabbitmq-handler.interface';

export const RABBITMQ_HANDLER_METADATA = 'rabbitmq:handler';

export const RabbitMQHandler = (options: RabbitMQHandlerOptions) =>
  SetMetadata(RABBITMQ_HANDLER_METADATA, options);
