import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { RabbitMQEventEmitter } from '../events/rabbitmq.events';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

export type EventListener = (
  message: RabbitMQMessageDto,
) => void | Promise<void>;

@Injectable()
export class RabbitMQEventListenerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQEventListenerService.name);
  private readonly eventEmitter = RabbitMQEventEmitter.getInstance();

  onModuleInit() {
    this.logger.log('RabbitMQ Event Listener Service initialized');
  }

  onModuleDestroy() {
    this.eventEmitter.removeAllListeners();
    this.logger.log('RabbitMQ Event Listener Service destroyed');
  }

  onUserCreated(listener: EventListener): void {
    this.eventEmitter.on('user.created', listener);
    this.logger.log('Registered listener for user.created event');
  }

  onUserUpdated(listener: EventListener): void {
    this.eventEmitter.on('user.updated', listener);
    this.logger.log('Registered listener for user.updated event');
  }

  onUserDeleted(listener: EventListener): void {
    this.eventEmitter.on('user.deleted', listener);
    this.logger.log('Registered listener for user.deleted event');
  }

  onEmailNotification(listener: EventListener): void {
    this.eventEmitter.on('email.notification', listener);
    this.logger.log('Registered listener for email.notification event');
  }

  removeListener(event: string, listener: EventListener): void {
    this.eventEmitter.removeListener(event, listener);
    this.logger.log(`Removed listener for ${event} event`);
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.eventEmitter.removeAllListeners(event);
      this.logger.log(`Removed all listeners for ${event} event`);
    } else {
      this.eventEmitter.removeAllListeners();
      this.logger.log('Removed all listeners');
    }
  }
}
