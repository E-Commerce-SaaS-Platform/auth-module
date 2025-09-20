import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';
import { RabbitMQEventEmitter } from '../events/rabbitmq.events';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQConsumerService.name);
  private readonly eventEmitter = RabbitMQEventEmitter.getInstance();

  constructor(private readonly amqpConnection: AmqpConnection) {}

  onModuleInit() {
    this.logger.log('RabbitMQ Consumer Service initialized');
  }

  @RabbitSubscribe({
    queue: 'user.created',
    exchange: 'user-service.user',
    routingKey: 'user.created',
  })
  handleUserCreated(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Received user created message', {
        correlationId: message.correlationId,
      });
      this.eventEmitter.emitUserCreated(message);
      this.logger.log('User created event emitted successfully');
    } catch (error) {
      this.logger.error('Failed to process user created message', error);
      throw error;
    }
  }

  @RabbitSubscribe({
    queue: 'user.updated',
    exchange: 'user-service.user',
    routingKey: 'user.updated',
  })
  handleUserUpdated(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Received user updated message', {
        correlationId: message.correlationId,
      });
      this.eventEmitter.emitUserUpdated(message);
      this.logger.log('User updated event emitted successfully');
    } catch (error) {
      this.logger.error('Failed to process user updated message', error);
      throw error;
    }
  }

  @RabbitSubscribe({
    queue: 'user.deleted',
    exchange: 'user-service.user',
    routingKey: 'user.deleted',
  })
  handleUserDeleted(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Received user deleted message', {
        correlationId: message.correlationId,
      });
      this.eventEmitter.emitUserDeleted(message);
      this.logger.log('User deleted event emitted successfully');
    } catch (error) {
      this.logger.error('Failed to process user deleted message', error);
      throw error;
    }
  }

  @RabbitSubscribe({
    queue: 'email.notification',
    exchange: 'user-service.notification',
    routingKey: 'email.*',
  })
  handleEmailNotification(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Received email notification message', {
        correlationId: message.correlationId,
      });
      this.eventEmitter.emitEmailNotification(message);
      this.logger.log('Email notification event emitted successfully');
    } catch (error) {
      this.logger.error('Failed to process email notification message', error);
      throw error;
    }
  }
}
