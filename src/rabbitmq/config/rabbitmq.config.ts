import { registerAs } from '@nestjs/config';
import { RabbitMQConfig } from './rabbitmq-config.type';

export default registerAs(
  'rabbitmq',
  (): RabbitMQConfig => ({
    uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
    exchanges: {
      default: process.env.RABBITMQ_KEYCLOAK_EXCHANGE || 'amq.topic',
      keycloak: process.env.RABBITMQ_KEYCLOAK_EXCHANGE || 'amq.topic',
    },
    queues: {
      keycloakUserRegistered: {
        name: 'keycloak.user.registered',
        exchange: 'amq.topic',
        routingKey: 'KK.EVENT.CLIENT.*.SUCCESS.*.REGISTER',
        options: { durable: true },
      },
      keycloakUserLoggedIn: {
        name: 'keycloak.user.logged_in',
        exchange: 'amq.topic',
        routingKey: 'KK.EVENT.CLIENT.*.SUCCESS.*.LOGIN',
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
