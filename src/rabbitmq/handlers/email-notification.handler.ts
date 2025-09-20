import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQHandler } from '../interfaces/rabbitmq-handler.interface';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';

@Injectable()
export class EmailNotificationHandler implements RabbitMQHandler {
  private readonly logger = new Logger(EmailNotificationHandler.name);

  async handle(message: RabbitMQMessageDto): Promise<void> {
    this.logger.log('Processing email notification', {
      event: message.event,
      correlationId: message.correlationId,
      data: message.data,
    });

    // Add your email sending logic here
    // For example: send email using nodemailer, sendgrid, etc.

    if (message.data) {
      const { to, subject, template, variables } = message.data;
      this.logger.log(`Sending email to: ${to}, subject: ${subject}`);

      // Simulate email sending
      await this.sendEmail(to, subject, template, variables);
    }
  }

  private sendEmail(
    to: string,
    _subject: string,
    _template: string,
    _variables: Record<string, any>,
  ): void {
    // Implement your email sending logic here
    this.logger.log(`Email sent successfully to ${to}`);
  }
}
