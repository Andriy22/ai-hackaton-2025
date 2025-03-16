import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { UserRole } from '@/features/dashboard/modules/users/types/types';
import { paths } from './paths';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  
  // If user is already authenticated, redirect them to their appropriate dashboard
  if (isAuthenticated && user) {
    const from = location.state?.from?.pathname || '';
    
    // If there's a redirect path and it's not the login page, go there
    if (from && from !== paths.auth.login) {
      return <Navigate to={from} replace />;
    }
    
    // Otherwise, redirect based on role
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

export default PublicRoute;
