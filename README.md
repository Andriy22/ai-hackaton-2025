# 👁️ Lumina-Secure: Enterprise Retina Security System

![Lumina-Secure](https://img.shields.io/badge/Lumina--Secure-1.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-10.0-red)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Azure](https://img.shields.io/badge/Azure-Integrated-0078D4)

Lumina-Secure is a comprehensive enterprise-grade solution for secure employee identity verification through advanced retina scanning technology. Our platform provides a robust biometric authentication system for organizations of all sizes, combining cutting-edge image processing algorithms with a user-friendly interface.

## 🔍 System Overview

The Lumina-Secure platform consists of three main components:

1. **🖥️ Client Application**: A modern web interface for organization management, employee registration, and retina validation
2. **🔌 Backend API**: A secure NestJS-based API for user management, authentication, and system operations
3. **🧠 Retina Analyzer**: A specialized Python service for advanced retina image processing and biometric comparison

## ✨ Key Features

### 👥 User & Organization Management
- Multi-tenant architecture supporting multiple organizations
- Role-based access control (Super Admin, Organization Admin, Validator)
- Comprehensive user and employee profile management

### 👁️ Advanced Retina Processing
- Sophisticated retina image preprocessing and feature extraction
- Multi-stage comparison algorithm for accurate identification
- Blood vessel pattern recognition and optic disc detection
- Local Binary Pattern (LBP) and Histogram of Oriented Gradients (HOG) feature extraction

### 🔐 Security & Authentication
- JWT-based authentication with refresh token mechanism
- Secure biometric validation with anti-spoofing measures
- Encrypted data storage and transmission
- Comprehensive audit logging

### 📊 Analytics & Reporting
- Real-time validation statistics and success rates
- Employee-specific validation history
- Organization-level analytics dashboard

### ☁️ Cloud Integration
- Azure Blob Storage for secure image management
- Azure Service Bus for reliable message processing
- Azure Cosmos DB for feature storage

## 🛠️ Technology Stack

### Backend API (NestJS)
- **🔧 Framework**: NestJS (Node.js)
- **📝 Language**: TypeScript
- **💾 Database**: PostgreSQL with Prisma ORM
- **🔑 Authentication**: JWT with Passport
- **📖 API Documentation**: Swagger and Scalar API Reference

### Retina Analyzer (Python)
- **🔧 Framework**: FastAPI
- **📝 Language**: Python 3.10
- **🖼️ Image Processing**: OpenCV, NumPy, SciPy
- **🧮 Machine Learning**: scikit-image, scikit-learn
- **🔌 API**: RESTful endpoints for retina validation

### Frontend (React)
- **⚛️ Framework**: React 18
- **📝 Language**: TypeScript
- **🎨 Styling**: TailwindCSS
- **🔄 State Management**: Zustand and React Query
- **🧩 UI Components**: Shadcn UI

### Cloud Services
- **💾 Storage**: Azure Blob Storage
- **📨 Messaging**: Azure Service Bus
- **🗄️ NoSQL Database**: Azure Cosmos DB

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.10+
- PostgreSQL database
- Azure account (for cloud features)
- Docker and Docker Compose (for containerized deployment)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/amdriy22/ai-hackaton-2025.git
cd lumina-secure
```

#### 2. Backend API Setup
```bash
cd backend/backend-api
npm install
# Configure .env file (see backend-api README)
npm run start:dev
```

#### 3. Retina Analyzer Setup
```bash
cd backend/backend-retina-analyzer
# Configure .env file (see backend-retina-analyzer README)
# Option 1: Docker
docker-compose up -d
# Option 2: Local development
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

#### 4. Frontend Setup
```bash
cd client
npm install
# Configure .env file (see client README)
npm run dev
```

## 📚 Documentation

- **Backend API**: Swagger UI available at `http://localhost:3000/api`
- **Retina Analyzer**: API documentation available at `http://localhost:8000/docs`
- **Client Application**: Component documentation in the `client/docs` directory

## 🔌 System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Client   │◄────►│   NestJS API    │◄────►│ Retina Analyzer │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                 ▲                        ▲
                                 │                        │
                                 ▼                        ▼
                         ┌─────────────────┐      ┌─────────────────┐
                         │                 │      │                 │
                         │   PostgreSQL    │      │  Azure Services │
                         │                 │      │                 │
                         └─────────────────┘      └─────────────────┘
```

## 🔒 Security Features

- Secure biometric validation with anti-spoofing detection
- Encrypted data storage and transmission
- Token-based authentication with short-lived access tokens
- Role-based access control
- Comprehensive logging and auditing

