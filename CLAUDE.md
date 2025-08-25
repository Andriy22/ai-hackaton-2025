# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Lumina-Secure is an enterprise retina security system with three main components:
- **Client**: React 19 + TypeScript frontend with TailwindCSS and Shadcn UI
- **Backend API**: NestJS + TypeScript API with PostgreSQL/Prisma
- **Retina Analyzer**: Python FastAPI service for retina image processing

## Key Commands

### Backend API (backend/backend-api)
```bash
npm install              # Install dependencies
npm run start:dev        # Run development server (port 3000)
npm run build           # Build for production
npm run lint            # Run ESLint
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run prisma:seed     # Seed database
npx prisma migrate dev  # Run migrations
npx prisma generate     # Generate Prisma client
```

### Client (client)
```bash
npm install         # Install dependencies
npm run dev         # Run development server (Vite)
npm run build       # Build for production
npm run lint        # Run ESLint
```

### Retina Analyzer (backend/backend-retina-analyzer)
```bash
# Docker deployment
docker-compose up -d

# Local development
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Architecture

### Backend API Structure
```
backend/backend-api/
├── src/
│   ├── modules/
│   │   ├── auth/         # JWT authentication, login/logout
│   │   ├── organizations/ # Organization management
│   │   ├── statistics/   # Validation statistics
│   │   ├── storage/      # Azure Blob Storage integration
│   │   └── users/        # User and employee management
│   ├── common/           # Shared utilities, guards, interceptors
│   ├── config/           # Configuration modules
│   └── prisma/           # Database service
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts          # Database seeding
```

### Client Structure
```
client/
├── src/
│   ├── features/        # Feature-specific components
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── components/     # Shared UI components
│   └── lib/           # Utilities and helpers
```

### Database Schema (Prisma)
Main entities:
- User (with roles: SUPER_ADMIN, ORGANIZATION_ADMIN, VALIDATOR)
- Organization
- Employee (belongs to Organization)
- RetinaImage (linked to Employee)
- ValidationSession & ValidationAttempt

### Authentication Flow
1. JWT-based authentication with access and refresh tokens
2. Access tokens expire in 15 minutes
3. Refresh tokens expire in 7 days
4. Guards: JwtGuard for protected routes, RolesGuard for role-based access

### Azure Integration
- **Blob Storage**: Stores retina images
- **Service Bus**: Message queue for async processing
- **Cosmos DB**: Stores retina feature vectors

### API Documentation
- Swagger UI: http://localhost:3000/api
- Retina Analyzer: http://localhost:8000/docs

## Environment Variables
Backend API requires:
- DATABASE_CONNECTION (PostgreSQL connection string)
- JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
- Azure credentials (AZURE_STORAGE_*, AZURE_SERVICE_BUS_*)

## Testing Strategy
- Unit tests: Test individual services and controllers
- E2E tests: Test complete API flows
- Run single test: `npm test -- path/to/test.spec.ts`

## Key Dependencies
- Backend: NestJS, Prisma, Passport, class-validator, @azure/storage-blob
- Frontend: React 19, Vite, TailwindCSS, Zustand, React Query, Shadcn UI
- Python: FastAPI, OpenCV, NumPy, scikit-learn