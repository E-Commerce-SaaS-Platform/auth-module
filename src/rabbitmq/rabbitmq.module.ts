import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AllConfigType } from '../config/config.type';
import rabbitmqConfig from './config/rabbitmq.config';
import { RabbitMQPublisherService } from './services/rabbitmq-publisher.service';
import { RabbitMQConsumerService } from './services/rabbitmq-consumer.service';
import { RabbitMQEventListenerService } from './services/rabbitmq-event-listener.service';

@Module({
  imports: [
    ConfigModule.forFeature(rabbitmqConfig),
    GolevelupRabbitMQModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        uri: configService.getOrThrow('rabbitmq.uri', { infer: true }),
        connectionInitOptions: { wait: false },
        exchanges: Object.values(
          configService.getOrThrow('rabbitmq.exchanges', { infer: true }),
        ).map((exchange) => ({
          name: exchange,
          type: 'topic',
          durable: true,
        })),
        queues: Object.values(
          configService.getOrThrow('rabbitmq.queues', { infer: true }),
        ).map((queue) => ({
          name: queue.name,
          exchange: queue.exchange,
          routingKey: queue.routingKey,
          options: queue.options,
        })),
        connectionOptions: configService.get('rabbitmq.connectionOptions', {
          infer: true,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RabbitMQPublisherService,
    RabbitMQConsumerService,
    RabbitMQEventListenerService,
  ],
  exports: [
    RabbitMQPublisherService,
    RabbitMQConsumerService,
    RabbitMQEventListenerService,
  ],
})
export class RabbitMQModule {}
