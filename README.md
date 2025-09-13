# User Service

A microservice for managing users in an E-Commerce SaaS Platform.

## Description

This service handles user management, profiles, multi-tenancy, roles & permissions, and user events for an E-Commerce SaaS Platform.

## Features

- **User Profiles**: Store user metadata (fullName, avatarUrl, phoneNumber, address, etc.)
- **Keycloak Integration**: Links to Keycloak userId for authentication
- **Multi-Tenancy**: Each user belongs to one or more tenants (stores/organizations)
- **Roles & Permissions**: Track roles per tenant (merchant_admin, staff, customer)
- **User Events**: Emit domain events via RabbitMQ/Kafka (user_created, user_updated, user_deleted)
- **PostgreSQL Database**: Relational database for user data
- **S3 File Storage**: Store user avatars and files
- **REST API**: Swagger documentation included

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **File Storage**: AWS S3
- **Authentication**: JWT (integrated with Keycloak)
- **Documentation**: Swagger
- **Testing**: Jest (Unit & E2E tests)
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js >= 16.0.0
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp env-example-relational .env
   ```

4. Configure your environment variables in `.env`

5. Run database migrations:
   ```bash
   npm run migration:run
   ```

6. Start the application:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/docs`.

## Environment Variables

See `env-example-relational` for all available configuration options.

## API Documentation

Once the service is running, visit `http://localhost:3000/docs` for interactive API documentation.
