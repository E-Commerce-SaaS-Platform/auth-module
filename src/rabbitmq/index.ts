// Module
export { RabbitMQModule } from './rabbitmq.module';

// Services (publisher retained for potential outgoing events)
export { RabbitMQPublisherService } from './services/rabbitmq-publisher.service';
export { RabbitMQConsumerService } from './services/rabbitmq-consumer.service';
export { RabbitMQEventListenerService } from './services/rabbitmq-event-listener.service';

// Handlers
export { KeycloakAuthHandler } from './handlers/keycloak-auth.handler';

// DTOs
export { RabbitMQMessageDto } from './dto/rabbitmq-message.dto';
export {
  KeycloakUserEventDto,
  KeycloakEventMessageDto,
} from './dto/keycloak-event.dto';

// (Removed unused handler interfaces/decorators exports)

// Configuration
export { RabbitMQConfig } from './config/rabbitmq-config.type';
export { default as rabbitmqConfig } from './config/rabbitmq.config';

// Events
export { RabbitMQEventEmitter } from './events/rabbitmq.events';
