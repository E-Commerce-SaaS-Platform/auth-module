import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQEventListenerService } from '../services/rabbitmq-event-listener.service';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

@Injectable()
export class ExampleEventListenerService implements OnModuleInit {
  private readonly logger = new Logger(ExampleEventListenerService.name);

  constructor(private readonly eventListener: RabbitMQEventListenerService) {}

  onModuleInit() {
    // Listen to user created events
    this.eventListener.onUserCreated(this.handleUserCreated.bind(this));

    // Listen to user updated events
    this.eventListener.onUserUpdated(this.handleUserUpdated.bind(this));

    // Listen to user deleted events
    this.eventListener.onUserDeleted(this.handleUserDeleted.bind(this));

    // Listen to email notification events
    this.eventListener.onEmailNotification(
      this.handleEmailNotification.bind(this),
    );
  }

  private async handleUserCreated(message: RabbitMQMessageDto): Promise<void> {
    this.logger.log('Example: User created event received', {
      correlationId: message.correlationId,
      data: message.data,
    });

    // Add your business logic here
    // For example: send welcome email, create user profile, etc.

    return Promise.resolve();
  }

  private handleUserUpdated(message: RabbitMQMessageDto): Promise<void> {
    this.logger.log('Example: User updated event received', {
      correlationId: message.correlationId,
      data: message.data,
    });

    // Add your business logic here
    // For example: update user profile, send notification, etc.

    return Promise.resolve();
  }

  private handleUserDeleted(message: RabbitMQMessageDto): Promise<void> {
    this.logger.log('Example: User deleted event received', {
      correlationId: message.correlationId,
      data: message.data,
    });

    // Add your business logic here
    // For example: cleanup user data, send goodbye email, etc.

    return Promise.resolve();
  }

  private handleEmailNotification(message: RabbitMQMessageDto): Promise<void> {
    this.logger.log('Example: Email notification event received', {
      correlationId: message.correlationId,
      data: message.data,
    });

    // Add your business logic here
    // For example: process email template, send email, etc.

    return Promise.resolve();
  }
}
