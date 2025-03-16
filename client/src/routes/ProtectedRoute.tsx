import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { UserRole } from '@/features/dashboard/modules/users/types/types';
import { paths } from './paths';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />;
  }

  // Check if user role is allowed to access this route
  if (user && !allowedRoles.includes(user.role as UserRole)) {
    // Redirect based on role
    if (user.role === UserRole.VALIDATOR) {
      return <Navigate to={paths.validation} replace />;
    } else if (user.role === UserRole.ADMIN && user.organizationId) {
      return <Navigate to={paths.organizations.details(user.organizationId)} replace />;
    } else {
      return <Navigate to={paths.dashboard} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
