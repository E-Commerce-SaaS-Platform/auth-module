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

  emitUserCreated(message: RabbitMQMessageDto): void {
    this.emit('user.created', message);
  }

  emitUserUpdated(message: RabbitMQMessageDto): void {
    this.emit('user.updated', message);
  }

  emitUserDeleted(message: RabbitMQMessageDto): void {
    this.emit('user.deleted', message);
  }

  emitEmailNotification(message: RabbitMQMessageDto): void {
    this.emit('email.notification', message);
  }
}
