export class KeycloakUserEventDto {
  userId: string;

  username: string;

  email: string;

  firstName?: string;

  lastName?: string;

  realm: string;

  clientId: string;

  timestamp: string;

  ipAddress?: string;

  userAgent?: string;
}

export class KeycloakEventMessageDto {
  event: string;

  correlationId?: string;

  timestamp?: string;

  data?: KeycloakUserEventDto;

  metadata?: Record<string, any>;
}
