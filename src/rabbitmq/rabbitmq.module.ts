import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './config/rabbitmq.config';
import { KeycloakAuthHandler } from './handlers/keycloak-auth.handler';
import { RabbitMQConsumerService } from './services/rabbitmq-consumer.service';
import { RabbitMQEventListenerService } from './services/rabbitmq-event-listener.service';
import { RabbitMQPublisherService } from './services/rabbitmq-publisher.service';

@Module({
  imports: [ConfigModule.forFeature(rabbitmqConfig)],
  providers: [
    RabbitMQPublisherService,
    RabbitMQConsumerService,
    RabbitMQEventListenerService,
    KeycloakAuthHandler,
  ],
  exports: [
    RabbitMQPublisherService,
    RabbitMQConsumerService,
    RabbitMQEventListenerService,
  ],
})
export class RabbitMQModule {}
