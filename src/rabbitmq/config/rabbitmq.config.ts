import { registerAs } from '@nestjs/config';
import { RabbitMQConfig } from './rabbitmq-config.type';

export default registerAs(
  'rabbitmq',
  (): RabbitMQConfig => ({
    uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
    exchanges: {
      default: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'user-service',
      user: process.env.RABBITMQ_USER_EXCHANGE || 'user-service.user',
      notification:
        process.env.RABBITMQ_NOTIFICATION_EXCHANGE ||
        'user-service.notification',
    },
    queues: {
      userCreated: {
        name: 'user.created',
        exchange: 'user-service.user',
        routingKey: 'user.created',
        options: { durable: true },
      },
      userUpdated: {
        name: 'user.updated',
        exchange: 'user-service.user',
        routingKey: 'user.updated',
        options: { durable: true },
      },
      userDeleted: {
        name: 'user.deleted',
        exchange: 'user-service.user',
        routingKey: 'user.deleted',
        options: { durable: true },
      },
      emailNotification: {
        name: 'email.notification',
        exchange: 'user-service.notification',
        routingKey: 'email.*',
        options: { durable: true },
      },
    },
    connectionOptions: {
      heartbeat: parseInt(process.env.RABBITMQ_HEARTBEAT || '60'),
      connectionTimeout: parseInt(
        process.env.RABBITMQ_CONNECTION_TIMEOUT || '30000',
      ),
      reconnectTimeInSeconds: parseInt(
        process.env.RABBITMQ_RECONNECT_TIME || '5',
      ),
    },
  }),
);
