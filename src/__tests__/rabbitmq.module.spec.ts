import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

describe('RabbitMQModule', () => {
  it('should be defined', () => {
    expect(RabbitMQModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof RabbitMQModule).toBe('function');
  });
});
