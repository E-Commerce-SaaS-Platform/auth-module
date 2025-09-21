# @E-Commerce-SaaS-Platform/auth-module

A NestJS RabbitMQ consumer module that subscribes to queues and emits events for other services to listen to.

## Features

- **Consumer Service**: Automatic message consumption from RabbitMQ queues
- **Event Emitter**: Emits events that other services can listen to
- **Event Listener Service**: Easy event subscription for other services
- **Publisher Service**: Optional message publishing capabilities
- **Configuration**: Environment-based configuration management
- **Type Safety**: Full TypeScript support with DTOs and interfaces

## Installation

### Method 1: Direct GitHub Installation (Recommended)
```bash
# Using yarn
yarn add https://github.com/E-Commerce-SaaS-Platform/auth-module.git

# Using npm
npm install https://github.com/E-Commerce-SaaS-Platform/auth-module.git
```

### Method 2: GitHub Shorthand
```bash
# Using yarn
yarn add E-Commerce-SaaS-Platform/auth-module

# Using npm
npm install E-Commerce-SaaS-Platform/auth-module
```

### Method 3: Using Package Registry
```bash
# Using yarn
yarn add @E-Commerce-SaaS-Platform/auth-module

# Using npm
npm install @E-Commerce-SaaS-Platform/auth-module
```

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

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@E-Commerce-SaaS-Platform/auth-module';

@Module({
  imports: [RabbitMQModule],
})
export class AppModule {}
```

### 2. Listen to Events

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQEventListenerService } from '@E-Commerce-SaaS-Platform/auth-module';
import { RabbitMQMessageDto } from '@E-Commerce-SaaS-Platform/auth-module';

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

### 3. Publish Messages (Optional)

```typescript
import { Injectable } from '@nestjs/common';
import { RabbitMQPublisherService, RabbitMQMessageDto } from '@E-Commerce-SaaS-Platform/auth-module';

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

## Available Events

- `user.created` - User creation events
- `user.updated` - User update events  
- `user.deleted` - User deletion events
- `email.notification` - Email notification events

## Dependencies

This package requires the following peer dependencies:

- `@nestjs/common` (^10.0.0 || ^11.0.0)
- `@nestjs/core` (^10.0.0 || ^11.0.0)
- `@nestjs/config` (^3.0.0 || ^4.0.0)
- `@golevelup/nestjs-rabbitmq` (^2.0.0 || ^3.0.0)
- `amqplib` (^0.10.0 || ^0.11.0)
- `rxjs` (^7.0.0 || ^8.0.0)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request