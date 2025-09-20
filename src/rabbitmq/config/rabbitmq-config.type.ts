export interface RabbitMQConfig {
  uri: string;
  exchanges: {
    default: string;
    [key: string]: string;
  };
  queues: {
    [key: string]: {
      name: string;
      exchange: string;
      routingKey: string;
      options?: any;
    };
  };
  connectionOptions?: {
    heartbeat?: number;
    connectionTimeout?: number;
    reconnectTimeInSeconds?: number;
  };
}
