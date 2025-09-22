export class RabbitMQMessageDto<T = any> {
  event: string;

  correlationId?: string;

  timestamp?: string;

  data?: T;

  metadata?: Record<string, any>;
}
