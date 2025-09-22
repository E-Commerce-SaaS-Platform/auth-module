import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQEventListenerService } from '../services/rabbitmq-event-listener.service';
import { RabbitMQPublisherService } from '../services/rabbitmq-publisher.service';
import { RabbitMQMessageDto } from '../dto/rabbitmq-message.dto';
import { KeycloakUserEventDto } from '../dto/keycloak-event.dto';

@Injectable()
export class KeycloakAuthHandler implements OnModuleInit {
  private readonly logger = new Logger(KeycloakAuthHandler.name);

  constructor(
    private readonly eventListenerService: RabbitMQEventListenerService,
    private readonly publisherService: RabbitMQPublisherService,
  ) {}

  onModuleInit() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for Keycloak user registration events
    this.eventListenerService.onKeycloakUserRegistered(
      this.handleUserRegistration.bind(this),
    );

    // Listen for Keycloak user login events
    this.eventListenerService.onKeycloakUserLoggedIn(
      this.handleUserLogin.bind(this),
    );
  }

  private parseKeycloakEventData(
    keycloakEventData: any,
    _eventType: 'REGISTER' | 'LOGIN',
  ): KeycloakUserEventDto {
    // The keycloak-to-rabbit provider may send data in different formats
    // This method handles various possible structures

    // Extract user information from the event data
    const userId =
      keycloakEventData.userId ||
      keycloakEventData.id ||
      keycloakEventData.user?.id;
    const username =
      keycloakEventData.username || keycloakEventData.user?.username;
    const email = keycloakEventData.email || keycloakEventData.user?.email;
    const firstName =
      keycloakEventData.firstName || keycloakEventData.user?.firstName;
    const lastName =
      keycloakEventData.lastName || keycloakEventData.user?.lastName;
    const realm = keycloakEventData.realm || keycloakEventData.realmId;
    const clientId =
      keycloakEventData.clientId || keycloakEventData.client?.clientId;

    // Extract timestamp - try different possible fields
    const timestamp =
      keycloakEventData.timestamp ||
      keycloakEventData.time ||
      keycloakEventData.eventTime ||
      new Date().toISOString();

    // Extract IP and user agent from session or details
    const ipAddress =
      keycloakEventData.ipAddress ||
      keycloakEventData.sessionDetails?.ipAddress ||
      keycloakEventData.details?.ipAddress;
    const userAgent =
      keycloakEventData.userAgent ||
      keycloakEventData.sessionDetails?.userAgent ||
      keycloakEventData.details?.userAgent;

    return {
      userId: userId || 'unknown',
      username: username || 'unknown',
      email: email || 'unknown@example.com',
      firstName,
      lastName,
      realm: realm || 'unknown',
      clientId: clientId || 'unknown',
      timestamp:
        typeof timestamp === 'number'
          ? new Date(timestamp).toISOString()
          : timestamp,
      ipAddress,
      userAgent,
    };
  }

  private async handleUserRegistration(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Processing Keycloak user registration event', {
        correlationId: message.correlationId,
        event: message.event,
        data: message.data,
      });

      // Parse Keycloak event data - the structure may vary based on the provider
      const keycloakEventData = message.data as any;
      const userData = this.parseKeycloakEventData(
        keycloakEventData,
        'REGISTER',
      );

      // Log the registration event with detailed information
      this.logger.log('User registered via Keycloak', {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        realm: userData.realm,
        clientId: userData.clientId,
        timestamp: userData.timestamp,
        ipAddress: userData.ipAddress,
        userAgent: userData.userAgent,
      });

      // Emit corresponding internal event for user registration
      await this.emitUserRegistrationEvent(message, userData);

      this.logger.log(
        'Keycloak user registration event processed successfully',
      );
    } catch (error) {
      this.logger.error(
        'Failed to process Keycloak user registration event',
        error,
      );
    }
  }

  private async handleUserLogin(message: RabbitMQMessageDto) {
    try {
      this.logger.log('Processing Keycloak user login event', {
        correlationId: message.correlationId,
        event: message.event,
        data: message.data,
      });

      // Parse Keycloak event data - the structure may vary based on the provider
      const keycloakEventData = message.data as any;
      const userData = this.parseKeycloakEventData(keycloakEventData, 'LOGIN');

      // Log the login event with detailed information
      this.logger.log('User logged in via Keycloak', {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        realm: userData.realm,
        clientId: userData.clientId,
        timestamp: userData.timestamp,
        ipAddress: userData.ipAddress,
        userAgent: userData.userAgent,
      });

      // Emit corresponding internal event for user login
      await this.emitUserLoginEvent(message, userData);

      this.logger.log('Keycloak user login event processed successfully');
    } catch (error) {
      this.logger.error('Failed to process Keycloak user login event', error);
    }
  }

  private async emitUserRegistrationEvent(
    originalMessage: RabbitMQMessageDto,
    userData: KeycloakUserEventDto,
  ) {
    try {
      const registrationEvent: RabbitMQMessageDto = {
        event: 'auth.user.registered',
        correlationId: originalMessage.correlationId,
        timestamp: new Date().toISOString(),
        data: {
          source: 'keycloak',
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          realm: userData.realm,
          clientId: userData.clientId,
          registrationTimestamp: userData.timestamp,
          ipAddress: userData.ipAddress,
          userAgent: userData.userAgent,
        },
        metadata: {
          originalEvent: originalMessage.event,
          processedAt: new Date().toISOString(),
        },
      };

      await this.publisherService.publish(
        'user-service.user',
        'auth.user.registered',
        registrationEvent,
      );

      this.logger.log('Emitted auth.user.registered event', {
        correlationId: registrationEvent.correlationId,
      });
    } catch (error) {
      this.logger.error('Failed to emit user registration event', error);
    }
  }

  private async emitUserLoginEvent(
    originalMessage: RabbitMQMessageDto,
    userData: KeycloakUserEventDto,
  ) {
    try {
      const loginEvent: RabbitMQMessageDto = {
        event: 'auth.user.logged_in',
        correlationId: originalMessage.correlationId,
        timestamp: new Date().toISOString(),
        data: {
          source: 'keycloak',
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          realm: userData.realm,
          clientId: userData.clientId,
          loginTimestamp: userData.timestamp,
          ipAddress: userData.ipAddress,
          userAgent: userData.userAgent,
        },
        metadata: {
          originalEvent: originalMessage.event,
          processedAt: new Date().toISOString(),
        },
      };

      await this.publisherService.publish(
        'user-service.user',
        'auth.user.logged_in',
        loginEvent,
      );

      this.logger.log('Emitted auth.user.logged_in event', {
        correlationId: loginEvent.correlationId,
      });
    } catch (error) {
      this.logger.error('Failed to emit user login event', error);
    }
  }
}
