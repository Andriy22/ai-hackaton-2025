# Retina Recognition System - Client Application

## Overview

This is the client-side application for the Retina Recognition System, a sophisticated platform designed for secure biometric authentication using retina scanning technology. The application is built with modern web technologies and follows best practices for security, accessibility, and user experience.

## Features

### Authentication & Authorization

- **Secure Login System**: JWT-based authentication with refresh token mechanism
- **Role-Based Access Control**: Different user roles (VALIDATOR, ORG_ADMIN, SUPER_ADMIN) with specific permissions
- **Protected Routes**: Secure route protection based on user roles
- **Public Routes**: Accessible routes for unauthenticated users

### Dashboard

- **Organization Management**: Create, view, update, and delete organizations
- **User Management**: Comprehensive user administration with role assignment
- **Employee Management**: Add, edit, and manage employee records
- **Validation Statistics**: Visual analytics for validation success rates and trends

### Validation System

- **Retina Image Validation**: Upload and validate retina images against the database
- **Real-time Feedback**: Immediate validation results with clear visual indicators
- **Employee Details**: View matched employee information upon successful validation
- **Validation History**: Track and review past validation attempts

### Account Management

- **Profile Settings**: User profile management with personal information
- **Password Management**: Secure password change functionality
- **Account Preferences**: Customizable user preferences

## Technical Architecture

### Core Technologies

- **React 18**: Modern component-based UI library
- **TypeScript**: Type-safe JavaScript for improved developer experience
- **Vite**: Next-generation frontend build tool for fast development
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Animation library for smooth transitions and effects

### State Management

- **Zustand**: Lightweight state management solution
- **React Query**: Data fetching and caching library
- **Custom Hooks**: Specialized hooks for auth, validation, and other features

### UI Components

- **Shadcn UI**: High-quality, accessible UI components
- **Lucide Icons**: Beautiful, consistent icon set
- **Recharts**: Composable charting library for statistics visualization

### Routing

- **React Router**: Declarative routing for React applications
- **Custom Route Guards**: ProtectedRoute and PublicRoute components for access control
- **Centralized Path Management**: Organized route paths in dedicated files

### API Integration

- **Fetch API**: Modern HTTP client with custom interceptors
- **Form Handling**: Efficient form state management and validation
- **Error Handling**: Comprehensive error management with user-friendly feedback

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components (buttons, inputs, etc.)
│   ├── features/        # Feature-based modules
│   │   ├── auth/        # Authentication related code
│   │   ├── dashboard/   # Dashboard features
│   │   └── validation/  # Validation system
│   ├── lib/             # Utility functions and helpers
│   ├── pages/           # Page components
│   ├── routes/          # Routing configuration
│   ├── styles/          # Global styles and theme configuration
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

### Environment Variables

Create a `.env` file in the client directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:3000
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained permissions based on user roles
- **HTTP-only Cookies**: Secure storage of authentication tokens
- **Input Validation**: Comprehensive validation of user inputs
- **Error Handling**: Secure error handling without exposing sensitive information

## Accessibility

- **ARIA Attributes**: Proper accessibility attributes for all interactive elements
- **Keyboard Navigation**: Full keyboard support for all features
- **Focus Management**: Proper focus handling for modals and dialogs
- **Color Contrast**: WCAG-compliant color contrast ratios
- **Screen Reader Support**: Semantic HTML and appropriate ARIA roles

## Performance Optimizations

- **Code Splitting**: Dynamic imports for route-based code splitting
- **Lazy Loading**: Components and routes loaded on demand
- **Memoization**: Optimized rendering with React.memo and useMemo
- **Virtualization**: Efficient rendering of large lists
- **Asset Optimization**: Optimized images and assets

## Best Practices

- **TypeScript**: Strong typing for improved code quality
- **ESLint & Prettier**: Code quality and formatting tools
- **Component Architecture**: Modular, reusable component design
- **Custom Hooks**: Encapsulated logic in reusable hooks
- **Testing**: Unit and integration tests for critical functionality

## Contributors

- Development Team @ AI Hackathon 2025

## License

This project is proprietary and confidential.
