import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQHandler } from '../interfaces/rabbitmq-handler.interface';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

@Injectable()
export class UserCreatedHandler implements RabbitMQHandler {
  private readonly logger = new Logger(UserCreatedHandler.name);

  handle(message: RabbitMQMessageDto): Promise<void> {
    this.logger.log('Processing user created event', {
      event: message.event,
      correlationId: message.correlationId,
      data: message.data,
    });

    // Add your business logic here
    // For example: send welcome email, create user profile, etc.

    if (message.data) {
      const { userId, email, name } = message.data;
      this.logger.log(`User created: ${name} (${email}) with ID: ${userId}`);
    }

    return Promise.resolve();
  }
}
