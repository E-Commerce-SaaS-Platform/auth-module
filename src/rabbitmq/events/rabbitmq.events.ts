import { EventEmitter } from 'events';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

export class RabbitMQEventEmitter extends EventEmitter {
  private static instance: RabbitMQEventEmitter;

  static getInstance(): RabbitMQEventEmitter {
    if (!RabbitMQEventEmitter.instance) {
      RabbitMQEventEmitter.instance = new RabbitMQEventEmitter();
    }
    return RabbitMQEventEmitter.instance;
  }

  emitKeycloakUserRegistered(message: RabbitMQMessageDto): void {
    this.emit('keycloak.user.registered', message);
  }

  emitKeycloakUserLoggedIn(message: RabbitMQMessageDto): void {
    this.emit('keycloak.user.logged_in', message);
  }
}
