import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { 
  RabbitMQModule, 
  RabbitMQEventListenerService, 
  RabbitMQMessageDto 
} from '@E-Commerce-SaaS-Platform/auth-module';

// Example service that listens to RabbitMQ events
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

// Example module configuration
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
  ],
  providers: [UserService],
})
export class AppModule {}
