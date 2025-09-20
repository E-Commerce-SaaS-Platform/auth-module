// Module
export { RabbitMQModule } from './rabbitmq.module';

// Services
export { RabbitMQPublisherService } from './services/rabbitmq-publisher.service';
export { RabbitMQConsumerService } from './services/rabbitmq-consumer.service';
export { RabbitMQEventListenerService } from './services/rabbitmq-event-listener.service';

// DTOs
export { RabbitMQMessageDto } from './dto/rabbitmq-message.dto';

// Interfaces
export {
  RabbitMQHandler,
  RabbitMQHandlerOptions,
} from './interfaces/rabbitmq-handler.interface';

// Decorators
export { RabbitMQHandler as RabbitMQHandlerDecorator } from './decorators/rabbitmq-handler.decorator';

// Configuration
export { RabbitMQConfig } from './config/rabbitmq-config.type';
export { default as rabbitmqConfig } from './config/rabbitmq.config';

// Events
export { RabbitMQEventEmitter } from './events/rabbitmq.events';
