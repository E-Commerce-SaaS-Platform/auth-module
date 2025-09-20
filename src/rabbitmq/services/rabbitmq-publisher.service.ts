import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

@Injectable()
export class RabbitMQPublisherService {
  private readonly logger = new Logger(RabbitMQPublisherService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish<T>(
    exchange: string,
    routingKey: string,
    message: RabbitMQMessageDto<T>,
    options?: {
      persistent?: boolean;
      expiration?: string;
      priority?: number;
    },
  ): Promise<void> {
    try {
      const messageWithTimestamp = {
        ...message,
        timestamp: message.timestamp || new Date().toISOString(),
      };

      await this.amqpConnection.publish(
        exchange,
        routingKey,
        messageWithTimestamp,
        options,
      );

      this.logger.log(
        `Message published to exchange: ${exchange}, routingKey: ${routingKey}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish message to exchange: ${exchange}, routingKey: ${routingKey}`,
        error,
      );
      throw error;
    }
  }

  async publishToQueue<T>(
    queue: string,
    message: RabbitMQMessageDto<T>,
    options?: {
      persistent?: boolean;
      expiration?: string;
      priority?: number;
    },
  ): Promise<void> {
    try {
      const messageWithTimestamp = {
        ...message,
        timestamp: message.timestamp || new Date().toISOString(),
      };

      await this.amqpConnection.publish(
        '',
        queue,
        messageWithTimestamp,
        options,
      );

      this.logger.log(`Message published to queue: ${queue}`);
    } catch (error) {
      this.logger.error(`Failed to publish message to queue: ${queue}`, error);
      throw error;
    }
  }
}
