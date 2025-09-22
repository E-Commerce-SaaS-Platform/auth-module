import { AppConfig } from './app-config.type';
import { RabbitMQConfig } from '../rabbitmq/config/rabbitmq-config.type';

export type AllConfigType = {
  app: AppConfig;
  rabbitmq: RabbitMQConfig;
};
