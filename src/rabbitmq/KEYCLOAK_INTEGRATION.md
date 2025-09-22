# Keycloak RabbitMQ Integration

This module provides integration between Keycloak and RabbitMQ for handling authentication events.

## Overview

The integration listens for Keycloak events (user registration and login) via RabbitMQ and processes them by:
1. Logging the events with detailed information
2. Emitting corresponding internal events for further processing

## Configuration

### Environment Variables

Add these environment variables to your `.env` file:

```env
# Keycloak RabbitMQ Configuration
RABBITMQ_KEYCLOAK_EXCHANGE=amq.topic
```

### Keycloak Setup

To enable Keycloak to send events to RabbitMQ, you need to:

1. Install the Keycloak-to-Rabbit provider
2. Configure the provider with the following settings:
   - Exchange: `amq.topic` (default RabbitMQ topic exchange)
   - Routing Keys: 
     - `KK.EVENT.CLIENT.*.SUCCESS.*.REGISTER` for user registration events
     - `KK.EVENT.CLIENT.*.SUCCESS.*.LOGIN` for user login events

## Events

### Keycloak Routing Key Pattern

The keycloak-to-rabbit provider uses the following routing key pattern:

```
KK.EVENT.CLIENT.<REALM>.<RESULT>.<CLIENT>.<EVENT_TYPE>
```

Where:
- `<REALM>`: The Keycloak realm where the event occurred
- `<RESULT>`: The outcome of the event (SUCCESS, ERROR)
- `<CLIENT>`: The client associated with the event
- `<EVENT_TYPE>`: The specific event type (REGISTER, LOGIN, etc.)

**Examples:**
- `KK.EVENT.CLIENT.myrealm.SUCCESS.myclient.REGISTER`
- `KK.EVENT.CLIENT.myrealm.SUCCESS.myclient.LOGIN`

Our consumers use wildcard patterns to match all realms and clients:
- `KK.EVENT.CLIENT.*.SUCCESS.*.REGISTER` - All successful registrations
- `KK.EVENT.CLIENT.*.SUCCESS.*.LOGIN` - All successful logins

### Consumed Events

#### `keycloak.user.registered`
- **Exchange**: `amq.topic`
- **Routing Key**: `KK.EVENT.CLIENT.*.SUCCESS.*.REGISTER`
- **Queue**: `keycloak.user.registered`

Triggered when a user registers via Keycloak. Uses wildcard pattern to match all realms and clients.

#### `keycloak.user.logged_in`
- **Exchange**: `amq.topic`
- **Routing Key**: `KK.EVENT.CLIENT.*.SUCCESS.*.LOGIN`
- **Queue**: `keycloak.user.logged_in`

Triggered when a user logs in via Keycloak. Uses wildcard pattern to match all realms and clients.

### Emitted Events

#### `auth.user.registered`
- **Exchange**: `user-service.user`
- **Routing Key**: `auth.user.registered`

Emitted after processing a Keycloak user registration event.

#### `auth.user.logged_in`
- **Exchange**: `user-service.user`
- **Routing Key**: `auth.user.logged_in`

Emitted after processing a Keycloak user login event.

## Event Data Structure

### Keycloak Event Data

```typescript
interface KeycloakUserEventDto {
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
```

### Internal Event Data

The internal events include all the original Keycloak data plus additional metadata:

```typescript
{
  event: 'auth.user.registered' | 'auth.user.logged_in',
  correlationId: string,
  timestamp: string,
  data: {
    source: 'keycloak',
    userId: string,
    username: string,
    email: string,
    firstName?: string,
    lastName?: string,
    realm: string,
    clientId: string,
    registrationTimestamp?: string, // for registration events
    loginTimestamp?: string,        // for login events
    ipAddress?: string,
    userAgent?: string,
  },
  metadata: {
    originalEvent: string,
    processedAt: string,
  }
}
```

## Usage

The integration is automatically initialized when the `RabbitMQModule` is imported. The `KeycloakAuthHandler` will:

1. Listen for Keycloak events
2. Log detailed information about each event
3. Emit corresponding internal events

### Listening to Internal Events

To listen to the processed events in your application:

```typescript
import { RabbitMQEventListenerService } from './rabbitmq/services/rabbitmq-event-listener.service';

@Injectable()
export class YourService {
  constructor(
    private readonly eventListenerService: RabbitMQEventListenerService,
  ) {
    // Listen for user registration events
    this.eventListenerService.onKeycloakUserRegistered((message) => {
      console.log('User registered:', message.data);
    });

    // Listen for user login events
    this.eventListenerService.onKeycloakUserLoggedIn((message) => {
      console.log('User logged in:', message.data);
    });
  }
}
```

## Logging

The integration provides comprehensive logging for:
- Received Keycloak events
- Event processing status
- Emitted internal events
- Error handling

All logs include correlation IDs for tracing events through the system.

## Error Handling

The integration includes robust error handling:
- Failed event processing is logged but doesn't crash the service
- Original events are preserved for retry mechanisms
- Detailed error information is logged for debugging
