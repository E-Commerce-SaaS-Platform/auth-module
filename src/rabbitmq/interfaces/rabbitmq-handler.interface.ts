import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

export interface RabbitMQHandler<T = any> {
  handle(message: RabbitMQMessageDto<T>): Promise<void>;
}

export interface RabbitMQHandlerOptions {
  queue: string;
  exchange?: string;
  routingKey?: string;
  prefetchCount?: number;
  retryAttempts?: number;
  retryDelay?: number;
}
