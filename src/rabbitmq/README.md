# RabbitMQ Consumer Module

This module provides a RabbitMQ consumer that subscribes to queues and emits events for other services to listen to using the `@golevelup/nestjs-rabbitmq` package.

## Features

- **Consumer Service**: Automatic message consumption from RabbitMQ queues
- **Event Emitter**: Emits events that other services can listen to
- **Event Listener Service**: Easy event subscription for other services
- **Publisher Service**: Optional message publishing capabilities
- **Configuration**: Environment-based configuration management
- **Type Safety**: Full TypeScript support with DTOs and interfaces

## Configuration

Add the following environment variables to your `.env` file:

```env
# RabbitMQ Configuration
RABBITMQ_URI=amqp://localhost:5672
RABBITMQ_DEFAULT_EXCHANGE=user-service
RABBITMQ_USER_EXCHANGE=user-service.user
RABBITMQ_NOTIFICATION_EXCHANGE=user-service.notification
RABBITMQ_HEARTBEAT=60
RABBITMQ_CONNECTION_TIMEOUT=30000
RABBITMQ_RECONNECT_TIME=5
```

## Usage

### Listening to Events

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQEventListenerService } from './rabbitmq/services/rabbitmq-event-listener.service';
import { RabbitMQMessageDto } from './rabbitmq/dto/rabbitmq-message.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly eventListener: RabbitMQEventListenerService) {}

  onModuleInit() {
    // Listen to user created events
    this.eventListener.onUserCreated(this.handleUserCreated.bind(this));
    
    // Listen to user updated events
    this.eventListener.onUserUpdated(this.handleUserUpdated.bind(this));
  }

  private async handleUserCreated(message: RabbitMQMessageDto): Promise<void> {
    console.log('User created:', message.data);
    // Your business logic here
  }

  private async handleUserUpdated(message: RabbitMQMessageDto): Promise<void> {
    console.log('User updated:', message.data);
    // Your business logic here
  }
}
```

### Publishing Messages (Optional)

```typescript
import { Injectable } from '@nestjs/common';
import { RabbitMQPublisherService } from './rabbitmq/services/rabbitmq-publisher.service';
import { RabbitMQMessageDto } from './rabbitmq/dto/rabbitmq-message.dto';

@Injectable()
export class UserService {
  constructor(private readonly publisher: RabbitMQPublisherService) {}

  async createUser(userData: any) {
    // Your user creation logic here
    
    // Publish user created event
    const message: RabbitMQMessageDto = {
      event: 'user.created',
      correlationId: `user-${userData.id}-${Date.now()}`,
      data: userData,
    };

    await this.publisher.publish(
      'user-service.user',
      'user.created',
      message,
      { persistent: true },
    );
  }
}
```

### Message DTO Structure

```typescript
interface RabbitMQMessageDto<T = any> {
  event: string;                    // Event type
  correlationId?: string;          // Unique correlation ID
  timestamp?: string;              // Message timestamp
  data?: T;                        // Message payload
  metadata?: Record<string, any>;  // Additional metadata
}
```

## Available Events

- `user.created` - User creation events
- `user.updated` - User update events  
- `user.deleted` - User deletion events
- `email.notification` - Email notification events

## Available Queues

- `user.created` - User creation events
- `user.updated` - User update events  
- `user.deleted` - User deletion events
- `email.notification` - Email notification events

## Available Exchanges

- `user-service` - Default exchange
- `user-service.user` - User-related events
- `user-service.notification` - Notification events

## Error Handling

The module includes comprehensive error handling:

- Connection retry logic
- Message acknowledgment
- Dead letter queue support
- Logging for debugging

## Testing

To test the RabbitMQ module:

1. Start RabbitMQ server
2. Run the application
3. Publish messages to the queues
4. Check logs for event processing

## Dependencies

- `@golevelup/nestjs-rabbitmq` - Core RabbitMQ integration
- `amqplib` - AMQP client library