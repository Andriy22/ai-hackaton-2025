import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { paths } from '@/routes/paths';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, refreshToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication state:', isAuthenticated);
      if (!isAuthenticated) {
        // Try to refresh the token if not authenticated
        await refreshToken();
      }
    };

    checkAuth();
  }, [isAuthenticated, refreshToken]);

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
