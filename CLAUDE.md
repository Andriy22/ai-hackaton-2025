# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lumina-Secure is an enterprise-grade biometric authentication system using retina scanning technology. The project consists of three main components:
- **Backend API**: NestJS/TypeScript API with PostgreSQL and Prisma ORM
- **Retina Analyzer**: Python/FastAPI service for retina image processing and comparison
- **Client**: React/TypeScript frontend with TailwindCSS and Shadcn UI

## Common Development Commands

### Backend API (backend/backend-api)
```bash
# Install dependencies
npm install

# Run development server
npm run start:dev

# Run production build
npm run build
npm run start:prod

# Database operations
npx prisma migrate dev     # Run migrations
npx prisma studio          # Open Prisma Studio
npm run prisma:seed        # Seed database

# Testing
npm run test               # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Run tests with coverage

# Code quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

### Retina Analyzer (backend/backend-retina-analyzer)
```bash
# Option 1: Run with Docker
docker-compose up -d

# Option 2: Run locally
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Access API documentation
# http://localhost:8000/docs
```

### Client (client)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Code quality
npm run lint
```

## Architecture Overview

### Backend API Structure
The NestJS backend follows a modular architecture:
- **modules/auth**: JWT authentication, login/register, token refresh
- **modules/organizations**: Multi-tenant organization management
- **modules/users**: User and employee management with role-based access
- **modules/storage**: Azure Blob Storage integration for retina images
- **modules/statistics**: Analytics and validation metrics
- **common**: Guards, decorators, filters, interceptors, DTOs
- **prisma**: Database service and schema management

### Retina Analyzer Components
- **retina_processor.py**: Core image processing algorithms (preprocessing, feature extraction, comparison)
- **service_bus.py**: Azure Service Bus integration for async processing
- **blob_storage.py**: Azure Blob Storage client for image management
- **cosmos_db.py**: Azure Cosmos DB for feature storage
- **app.py**: FastAPI application entry point

### Client Architecture
- **pages**: Route components (Landing, Dashboard, Organizations, Employees, Validation)
- **features**: Feature-specific components and logic
- **components/ui**: Shadcn UI components
- **lib**: Utilities, API client, stores (Zustand)
- **routes**: React Router configuration

## Key Integrations

### Azure Services
- **Blob Storage**: Stores retina images with container-based organization
- **Service Bus**: Async message processing for validation requests
- **Cosmos DB**: NoSQL storage for extracted retina features

### Authentication Flow
1. User login generates JWT access token (15min) and refresh token (7d)
2. Tokens stored in localStorage on client
3. API uses Passport JWT strategy with guards for protected routes
4. Role-based access: SuperAdmin, OrganizationAdmin, Validator

### Retina Validation Process
1. Employee registration captures retina image
2. Image uploaded to Azure Blob Storage
3. Retina Analyzer extracts features (blood vessels, optic disc, LBP, HOG)
4. Features stored in Cosmos DB with employee ID
5. Validation compares new scan against stored features
6. Multi-stage comparison returns similarity score

## API Documentation
- Backend API Swagger: http://localhost:3000/api
- Retina Analyzer OpenAPI: http://localhost:8000/docs

## Database Management
The project uses PostgreSQL with Prisma ORM. Key models:
- User (authentication, roles)
- Organization (multi-tenancy)
- Employee (biometric profiles)
- Validation (audit trail)

## Testing Strategy
- Backend: Jest for unit tests, Supertest for e2e
- Run specific test: `npm test -- path/to/test.spec.ts`
- Frontend: Component testing with React Testing Library (when implemented)