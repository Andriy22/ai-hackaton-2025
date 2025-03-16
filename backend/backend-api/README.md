# Lumina-Secure: Retina Management System

<p align="center">
  <img src="https://via.placeholder.com/200x200?text=Lumina-Secure" alt="Lumina-Secure Logo" width="200" />
</p>

## 🔍 Overview

Lumina-Secure is a comprehensive solution designed to manage an organization's retina identification system. The platform enables secure employee identity verification through retina scanning technology, providing a robust biometric authentication system for organizations of all sizes.

## ✨ Features

- **👥 User Management**: Create and manage users with different access levels (Super Admin, Organization Admin, Validator)
- **🏢 Organization Management**: Set up and manage multiple organizations
- **👤 Employee Management**: Register and manage employee profiles with personal information
- **👁️ Retina Scanning**: Store and process retina images for biometric identification
- **📊 Validation Statistics**: Track and analyze validation attempts and success rates
- **🔐 Authentication & Authorization**: Secure JWT-based authentication with refresh token mechanism
- **📚 API Documentation**: Interactive API documentation with Swagger and Scalar

## 🛠️ Technology Stack

### Backend
- **🔧 Framework**: NestJS (Node.js)
- **📝 Language**: TypeScript
- **💾 Database**: PostgreSQL with Prisma ORM
- **🔑 Authentication**: JWT (JSON Web Tokens) with Passport
- **📖 API Documentation**: Swagger and Scalar API Reference
- **✅ Validation**: Class-validator and Class-transformer
- **🔒 Security**: Bcrypt for password hashing
- **☁️ Cloud Services**: Azure Service Bus and Azure Blob Storage

### Development Tools
- **🧪 Testing**: Jest for unit and e2e testing
- **🧹 Linting**: ESLint with Prettier
- **🏗️ Build**: SWC for fast TypeScript compilation
- **📦 Package Management**: npm

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Azure account (for Service Bus and Blob Storage features)

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_CONNECTION=postgresql://username:password@localhost:5432/lumina_secure

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_CONTAINER_NAME=retina-images

# Azure Service Bus
AZURE_SERVICE_BUS_CONNECTION_STRING=your_azure_service_bus_connection_string
AZURE_SERVICE_BUS_QUEUE_NAME=retina-processing

# Application
PORT=3000
```

## 📥 Installation

```bash
# Install dependencies
$ npm install

# Generate Prisma client
$ npx prisma generate

# Run database migrations
$ npx prisma migrate dev

# Seed the database (optional)
$ npm run prisma:seed
```

## 🚀 Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run build
$ npm run start:prod

# Debug mode
$ npm run start:debug
```

## 📚 API Documentation

Once the application is running, you can access:

- Swagger UI: `http://localhost:3000/api`
- Scalar API Reference: `http://localhost:3000/docs`

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login with email and password | Public |
| POST | `/auth/refresh` | Refresh access token | Authenticated |
| POST | `/auth/logout` | Logout current session | Authenticated |
| POST | `/auth/logout-all` | Logout from all devices | Authenticated |

### 👥 Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/users` | Create a new user | Super Admin |
| GET | `/users` | Get all users with pagination | Super Admin |
| GET | `/users/:id` | Get user by ID | Super Admin |
| GET | `/users/email/find` | Find user by email | Super Admin |
| PUT | `/users/:id` | Update a user | Super Admin |
| DELETE | `/users/:id` | Delete a user | Super Admin |

### 🏢 Organizations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/organizations` | Create a new organization | Super Admin |
| GET | `/organizations` | Get all organizations with pagination | Super Admin |
| GET | `/organizations/:id` | Get organization by ID | Super Admin, Org Admin |
| PUT | `/organizations/:id` | Update an organization | Super Admin, Org Admin |
| DELETE | `/organizations/:id` | Delete an organization | Super Admin |
| GET | `/organizations/:id/users` | Get users in an organization | Super Admin, Org Admin |
| POST | `/organizations/:id/users` | Add a user to an organization | Super Admin, Org Admin |
| DELETE | `/organizations/:id/users/:userId` | Remove a user from an organization | Super Admin, Org Admin |
| PUT | `/organizations/:id/users/:userId` | Update a user's role in an organization | Super Admin, Org Admin |

### 👤 Employees

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/organizations/:id/employees` | Create a new employee | Super Admin, Org Admin |
| GET | `/organizations/:id/employees` | Get all employees in an organization | Super Admin, Org Admin |
| GET | `/organizations/employees/:employeeId` | Get employee by ID | Super Admin, Org Admin |
| PATCH | `/organizations/employees/:employeeId` | Update an employee | Super Admin, Org Admin |
| DELETE | `/organizations/employees/:employeeId` | Delete an employee | Super Admin, Org Admin |

### 👁️ Retina Images

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/storage/images/:imageName` | Get an image by name | Super Admin, Org Admin |
| POST | `/storage/upload` | Upload an image | Super Admin, Org Admin |
| POST | `/storage/organizations/:organizationId/employees/:employeeId/retinas` | Upload a retina photo for an employee | Super Admin, Org Admin |
| GET | `/storage/organizations/:organizationId/employees/:employeeId/retinas` | List all retina photos for an employee | Super Admin, Org Admin |
| GET | `/storage/organizations/:organizationId/employees/:employeeId/retinas/:retinaId` | Get a retina photo by ID | Super Admin, Org Admin |
| DELETE | `/storage/organizations/:organizationId/employees/:employeeId/retinas/:retinaId` | Delete a retina photo | Super Admin, Org Admin |
| POST | `/storage/validate-retina` | Validate a retina image | Super Admin, Org Admin |

### ✅ Validation

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/validation/retina` | Validate a retina image against existing employees | Super Admin, Org Admin, Validator |

### 📊 Statistics

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/statistics/daily` | Get daily validation statistics | Super Admin, Org Admin |
| GET | `/statistics/organization/:organizationId/employee/:employeeId/daily` | Get daily validation statistics for a specific employee | Super Admin, Org Admin |
| GET | `/statistics/total` | Get total validation statistics | Super Admin, Org Admin |

## 💾 Database Schema

The application uses PostgreSQL with Prisma ORM. Below is the database schema:

### User
- **id**: UUID (Primary Key)
- **firstName**: String
- **lastName**: String
- **email**: String (Unique)
- **password**: String (Hashed)
- **role**: Enum (SUPER_ADMIN, ORG_ADMIN, VALIDATOR)
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deleted**: Boolean
- **deletedAt**: DateTime (Optional)
- **organizationId**: UUID (Foreign Key to Organization, Optional)

### RefreshToken
- **id**: UUID (Primary Key)
- **token**: String (Unique)
- **userId**: UUID (Foreign Key to User)
- **expiresAt**: DateTime
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deleted**: Boolean
- **deletedAt**: DateTime (Optional)

### Organization
- **id**: UUID (Primary Key)
- **name**: String
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deleted**: Boolean
- **deletedAt**: DateTime (Optional)

### Employee
- **id**: UUID (Primary Key)
- **firstName**: String
- **lastName**: String
- **birthDate**: DateTime
- **position**: String
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deleted**: Boolean
- **deletedAt**: DateTime (Optional)
- **organizationId**: UUID (Foreign Key to Organization)

### RetinaImage
- **id**: UUID (Primary Key)
- **path**: String
- **features**: Float[] (Array of floating-point numbers)
- **documentId**: String (Optional, Cosmos DB document ID)
- **createdAt**: DateTime
- **updatedAt**: DateTime
- **deleted**: Boolean
- **deletedAt**: DateTime (Optional)
- **processedAt**: DateTime (Optional)
- **employeeId**: UUID (Foreign Key to Employee)

### ValidationStatistics
- **id**: UUID (Primary Key)
- **organizationId**: UUID (Foreign Key to Organization)
- **employeeId**: UUID (Foreign Key to Employee, Optional)
- **timestamp**: DateTime
- **isSuccessful**: Boolean
- **similarity**: Float (Optional)

### Entity Relationships

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│      User       │───┐   │  Organization   │───┐   │    Employee     │
│                 │   │   │                 │   │   │                 │
└────────┬────────┘   │   └────────┬────────┘   │   └────────┬────────┘
         │            │            │            │            │
         │            │            │            │            │
┌────────▼────────┐   │   ┌────────▼────────┐   │   ┌────────▼────────┐
│                 │   │   │                 │   │   │                 │
│  RefreshToken   │   └──►│ValidationStats  │◄──┘   │   RetinaImage   │
│                 │       │                 │───────│                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

## 📁 Project Structure

The project follows a modular architecture based on NestJS best practices:

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
│
├── modules/                # Feature modules
│   ├── users/              # User management
│   ├── organizations/      # Organization management
│   ├── employees/          # Employee management
│   ├── retina-images/      # Retina image processing
│   └── statistics/         # Validation statistics
│
├── common/                 # Shared resources
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   ├── guards/             # Route guards
│   ├── interceptors/       # Request/response interceptors
│   └── pipes/              # Validation pipes
│
└── config/                 # Configuration
    └── database.config.ts  # Database configuration
```

## 🧪 Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
