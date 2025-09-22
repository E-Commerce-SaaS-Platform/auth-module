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
    queue: 'keycloak.user.registered',
    exchange: 'amq.topic',
    routingKey: 'KK.EVENT.CLIENT.*.SUCCESS.*.REGISTER',
  })
  handleKeycloakUserRegistered(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Received Keycloak user registered message', {
        correlationId: message.correlationId,
        event: message.event,
        data: message.data,
      });
      this.eventEmitter.emitKeycloakUserRegistered(message);
      this.logger.log('Keycloak user registered event emitted successfully');
    } catch (error) {
      this.logger.error(
        'Failed to process Keycloak user registered message',
        error,
      );
      throw error;
    }
  }

  @RabbitSubscribe({
    queue: 'keycloak.user.logged_in',
    exchange: 'amq.topic',
    routingKey: 'KK.EVENT.CLIENT.*.SUCCESS.*.LOGIN',
  })
  handleKeycloakUserLoggedIn(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Received Keycloak user logged in message', {
        correlationId: message.correlationId,
        event: message.event,
        data: message.data,
      });
      this.eventEmitter.emitKeycloakUserLoggedIn(message);
      this.logger.log('Keycloak user logged in event emitted successfully');
    } catch (error) {
      this.logger.error(
        'Failed to process Keycloak user logged in message',
        error,
      );
      throw error;
    }
  }
}
